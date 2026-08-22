# Excel Module - Job-Based Import Implementation

## 🎯 Tổng quan

Module Excel đã được cập nhật để hỗ trợ **import không đồng bộ** thông qua **job system** với **real-time progress tracking** qua Socket.IO. Giải pháp này tránh timeout khi import file lớn và cung cấp trải nghiệm người dùng tốt hơn.

## 🔄 Quy trình Import (3 bước)

### 1️⃣ Upload File

```typescript
// Client upload file lên server
const uploadResult = await uploads({
  files: fileList,
  entity: FileEntityEnum.EXCEL_IMPORT,
  category: FileCategoryEnum.DOCUMENT,
});
// Nhận file object với ID
const fileId = uploadResult[0].id;
```

### 2️⃣ Gửi Yêu Cầu Import

```typescript
// Client gọi API import với fileId
dispatch(importExcel({
  entityType: ExcelEntityType.PRODUCT,
  fileId: "abc-123-xyz",
  errorHandling: ImportErrorHandling.SKIP_ERROR,
  duplicateHandling: ImportDuplicateHandling.UPDATE,
}));

// Server response NGAY LẬP TỨC
{
  "success": true,
  "message": "Đã nhận yêu cầu import. Job ID: 5199480d-...",
  "data": {
    "jobId": "5199480d-4878-4c26-b6d3-86cd8e8744fa"
  }
}
```

### 3️⃣ Nhận Progress Qua Socket

```typescript
// Client lắng nghe socket event 'import-progress'
socket.on('import-progress', (data: ImportProgressData) => {
  console.log(`${data.progress}%: ${data.successRows}/${data.totalRows}`);

  if (data.status === 'completed') {
    // Import hoàn tất!
  }
});

// Server gửi progress updates
{
  jobId: "5199480d-...",
  status: "processing",      // pending | processing | completed | failed
  progress: 45,              // 0-100
  totalRows: 1000,
  processedRows: 450,
  successRows: 430,
  errorRows: 10,
  skippedRows: 10,
  errors: [...],             // 10 lỗi gần nhất
  errorFileUrl: "/uploads/..." // Khi completed
}
```

## 📊 Flow Diagram

```
┌─────────┐                ┌─────────┐                ┌──────────────┐
│ Client  │                │ Server  │                │ Background   │
│         │                │         │                │ Job Worker   │
└────┬────┘                └────┬────┘                └──────┬───────┘
     │                          │                            │
     │ 1. Upload File           │                            │
     ├─────────────────────────>│                            │
     │<─────────────────────────┤                            │
     │      File ID              │                            │
     │                          │                            │
     │ 2. Import Request        │                            │
     │    (fileId + options)    │                            │
     ├─────────────────────────>│                            │
     │                          │  Create Job                │
     │                          ├───────────────────────────>│
     │<─────────────────────────┤                            │
     │   Job ID (Immediate)     │                            │
     │                          │                            │
     │                          │              [Processing...]
     │                          │                            │
     │ 3. Socket Progress       │      Progress Updates      │
     │<─────────────────────────┤<───────────────────────────┤
     │   (0%, 25%, 50%...)      │                            │
     │                          │                            │
     │ 4. Socket Complete       │      Job Completed         │
     │<─────────────────────────┤<───────────────────────────┤
     │   (Result + Stats)       │                            │
     │                          │                            │
```

## 🔧 Các thay đổi kỹ thuật

### 1. Models (src/models/base/excel.ts)

#### Job Response

```typescript
export interface ImportJobResponse extends ApiResponse {
  data: {
    jobId: string;
  };
}

export enum ImportJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}
```

#### Progress Data

```typescript
export interface ImportProgressData {
  jobId: string;
  status: ImportJobStatus;
  progress: number; // 0-100
  totalRows?: number;
  processedRows?: number;
  successRows?: number;
  errorRows?: number;
  skippedRows?: number;
  errors?: ImportError[]; // 10 lỗi gần nhất
  errorFileUrl?: string; // URL file lỗi đầy đủ khi completed
}
```

### 2. Redux Store (src/stores/excel/slice.ts)

#### State

```typescript
interface ExcelState {
  // ... existing states
  currentJobId: string | null;
  importProgress: ImportProgressData | null;
}
```

#### Actions

```typescript
// Khi nhận job response từ server
importExcelJobStarted(state, action: PayloadAction<ImportJobResponse>)

// Khi nhận progress từ socket
importExcelProgress(state, action: PayloadAction<ImportProgressData>)

// Khi có lỗi
importExcelFailure(state, action: PayloadAction<BaseFailurePayload>)
```

### 3. Saga (src/stores/excel/saga.ts)

```typescript
function* importExcelSaga(action: PayloadAction<ImportExcelData>): SagaIterator {
  try {
    const response = yield call(() => postData(apiEndpoint.excel.import, action.payload));
    // Response chứa jobId, không phải kết quả trực tiếp
    yield put(importExcelJobStarted(response));
  } catch (error: any) {
    yield put(importExcelFailure(handleErrorMessage(error, "update", "excel")));
  }
}
```

### 4. Component (ModalImportExcel.tsx)

#### Socket Listener

```typescript
useEffect(() => {
  const handleImportProgress = (data: ImportProgressData) => {
    setProgress(data);
    dispatch(importExcelProgress(data));

    if (data.status === ImportJobStatus.COMPLETED) {
      notification.success({
        message: "Import thành công",
        description: `Đã import ${data.successRows}/${data.totalRows} dòng`,
      });
    }
  };

  socket.on("import-progress", handleImportProgress);

  return () => {
    socket.off("import-progress", handleImportProgress);
  };
}, [dispatch]);
```

#### Progress UI

```tsx
{
  progress && progress.status !== ImportJobStatus.COMPLETED && (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Tiến trình import</span>
        <span>
          {progress.processedRows}/{progress.totalRows} dòng
        </span>
      </div>
      <Progress
        percent={progress.progress}
        status={progress.status === ImportJobStatus.PROCESSING ? "active" : "normal"}
      />
      <div className="mt-2 text-sm">
        <span className="text-green-600">Thành công: {progress.successRows}</span>
        {" | "}
        <span className="text-red-600">Lỗi: {progress.errorRows}</span>
        {" | "}
        <span className="text-gray-600">Bỏ qua: {progress.skippedRows}</span>
      </div>
    </div>
  );
}
```

## 🎨 User Experience

### Quy trình từ góc nhìn người dùng

1. **Upload File**
   - User chọn file Excel
   - Click "Tải file lên server"
   - Thấy notification "Tải file lên thành công"

2. **Cấu hình Import**
   - Chọn cách xử lý lỗi: Skip hoặc Stop
   - Chọn cách xử lý trùng: Update, Skip, hoặc Stop

3. **Bắt đầu Import**
   - Click "Nhập dữ liệu"
   - Thấy notification "Đã nhận yêu cầu import..."
   - Modal hiển thị progress bar

4. **Theo dõi Progress**
   - Progress bar cập nhật real-time
   - Hiển thị số dòng đã xử lý / tổng số dòng
   - Hiển thị số dòng thành công / lỗi / bỏ qua

5. **Hoàn tất**
   - Progress đạt 100%
   - Notification "Import thành công"
   - Modal tự đóng, data được refresh

## 🔌 Socket Events

### Client Subscribe

```typescript
socket.on("import-progress", (data: ImportProgressData) => {
  // Handle progress update
});
```

### Server Emit

```typescript
// Backend code (reference)
SocketUtils.sendSocketImportProgress(userId, {
  jobId: job.jobId,
  status: job.status,
  progress: job.progress,
  totalRows: job.totalRows,
  processedRows: job.processedRows,
  successRows: job.successRows,
  errorRows: job.errorRows,
  skippedRows: job.skippedRows,
  errors: job.errors.slice(-10), // Chỉ gửi 10 lỗi gần nhất
});
```

## 🎯 Ưu điểm của Job-Based System

### 1. **Tránh Timeout**

- Client không phải chờ toàn bộ quá trình import
- Server response ngay lập tức với job ID
- Import xử lý background không ảnh hưởng request timeout

### 2. **Real-time Feedback**

- User thấy tiến trình import real-time
- Biết chính xác bao nhiêu dòng đã xử lý
- Thấy ngay số lỗi và thành công

### 3. **Better UX**

- User không cảm thấy "treo" khi import file lớn
- Có thể đóng modal và làm việc khác
- Nhận notification khi hoàn tất

### 4. **Scalability**

- Server có thể queue nhiều job
- Xử lý parallel nếu cần
- Retry mechanism cho failed jobs

### 5. **Error Handling**

- Track được lỗi chi tiết từng dòng
- Export file lỗi để user xem lại
- Không làm crash toàn bộ import

## 🧪 Testing

### Test Cases

1. **Upload file nhỏ (< 100 rows)**
   - Expect: Import nhanh, progress bar hiển thị smooth

2. **Upload file lớn (> 1000 rows)**
   - Expect: Progress bar cập nhật từng đợt, không timeout

3. **File có lỗi với SKIP_ERROR**
   - Expect: Import tiếp tục, hiển thị số lỗi, có errorFileUrl

4. **File có lỗi với STOP_ON_ERROR**
   - Expect: Dừng ngay khi gặp lỗi, status = FAILED

5. **File có dữ liệu trùng với UPDATE**
   - Expect: Cập nhật records, hiển thị số updated

6. **Socket disconnect giữa chừng**
   - Expect: Job vẫn chạy backend, reconnect nhận progress mới

7. **User đóng modal giữa chừng**
   - Expect: Job vẫn chạy, user nhận notification khi done

## 📝 Backend Requirements

### API Endpoints

#### POST /excel/import

```typescript
Request Body: {
  entityType: ExcelEntityType;
  fileId: string;
  errorHandling: ImportErrorHandling;
  duplicateHandling: ImportDuplicateHandling;
  uniqueFields?: string[];
}

Response: {
  success: true,
  message: "Đã nhận yêu cầu import. Job ID: xxx",
  data: {
    jobId: string
  }
}
```

### Socket Events

#### import-progress

```typescript
{
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  totalRows?: number;
  processedRows?: number;
  successRows?: number;
  errorRows?: number;
  skippedRows?: number;
  errors?: ImportError[];
  errorFileUrl?: string;
}
```

### Job Processing

1. **Queue System**: Sử dụng Bull/BullMQ hoặc tương tự
2. **Progress Updates**: Emit socket mỗi X% hoặc mỗi Y giây
3. **Error Handling**: Catch errors, update job status
4. **File Cleanup**: Xóa temp files sau khi hoàn tất
5. **Retry Logic**: Retry failed jobs với exponential backoff

## 🚀 Deployment Notes

### Environment Variables

```env
# Socket
SOCKET_ENABLED=true
SOCKET_PATH=/socket.io

# Job Queue
REDIS_URL=redis://localhost:6379
JOB_QUEUE_NAME=excel-import
JOB_CONCURRENCY=5
```

### Socket Configuration

**Frontend** (src/services/socket.ts):

```typescript
const SOCKET_DISABLED = false; // Đặt false để enable socket
```

### Monitoring

- Track job queue length
- Monitor failed jobs
- Alert nếu job timeout (> 10 phút chẳng hạn)
- Log progress updates để debug

## 📚 Related Files

### Modified Files

- `src/models/base/excel.ts` - Job types
- `src/stores/excel/slice.ts` - Job actions & state
- `src/stores/excel/saga.ts` - Job response handling
- `src/components/modal/ModalImportExcel.tsx` - Socket listener & progress UI
- `src/services/socket.ts` - Socket service
- `src/constants/enum.ts` - Job status enum

### Documentation

- `EXCEL_MODULE_UPDATE.md` - Module overview
- `EXCEL_JOB_BASED_IMPORT.md` - This file

## 🆘 Troubleshooting

### Socket không nhận progress

**Check:**

1. `SOCKET_DISABLED = false` trong socket.ts
2. Backend đã emit event `import-progress` đúng format
3. User ID đúng (socket phải emit đến đúng user)
4. DevTools Network tab → WS → Messages

### Progress bar không cập nhật

**Check:**

1. `dispatch(importExcelProgress(data))` được gọi
2. Redux state `importProgress` được update
3. Component re-render khi state thay đổi

### Import bị stuck

**Check:**

1. Backend job có chạy không (check queue)
2. Backend có emit progress không (check logs)
3. Job có timeout không (check job status)

---

**Version:** 2.0 - Job-Based System  
**Last Updated:** 2026-02-02  
**Author:** Development Team
