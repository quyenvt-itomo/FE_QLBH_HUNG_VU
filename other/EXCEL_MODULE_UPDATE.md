# Excel Module Update - Frontend Synchronization

## Tổng quan

Module Excel đã được cập nhật để đồng bộ với backend, hỗ trợ quy trình import 2 bước:

1. **Bước 1**: Upload file lên server → nhận file object với ID
2. **Bước 2**: Import data sử dụng file ID + các tùy chọn xử lý

## Các thay đổi chính

### 1. Enums mới (src/constants/enum.ts)

```typescript
export enum ImportErrorHandling {
  STOP_ON_ERROR = "stop_on_error", // Dừng lại khi có lỗi
  SKIP_ERROR = "skip_error", // Bỏ qua dòng lỗi
}

export enum ImportDuplicateHandling {
  STOP = "stop", // Dừng lại báo trùng
  SKIP = "skip", // Bỏ qua dòng trùng
  UPDATE = "update", // Cập nhật thông tin mới
}

export enum FileEntityEnum {
  // ... existing values
  EXCEL_IMPORT = "excelImport", // Mới thêm
}
```

### 2. Models cập nhật (src/models/base/excel.ts)

#### Import Options

```typescript
export interface ImportExcelData {
  type: ExcelEntityType;
  fileId: string; // Thay đổi từ fileUrl sang fileId
  errorHandling: ImportErrorHandling;
  duplicateHandling: ImportDuplicateHandling;
  uniqueFields?: string[];
}
```

#### Import Result

```typescript
export interface ImportExcelResult {
  totalRows: number;
  successRows: number;
  errorRows: number;
  skippedRows: number;
  errors: ImportError[];
  data?: any[];
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  value?: any;
}
```

#### Template Options

```typescript
export interface ExcelTemplateQuery {
  type: ExcelEntityType;
  storeId?: string; // Cho các template cần context
  filters?: Record<string, any>;
}

export interface ExcelTemplateData {
  url: string;
  filename: string;
  expiresAt?: Date;
}
```

### 3. Redux State (src/stores/excel/slice.ts)

Thêm các state riêng cho từng giai đoạn:

```typescript
interface ExcelState {
  loading: boolean;
  uploadingFile: boolean; // Loading cho upload file
  importingData: boolean; // Loading cho import data
  // ... other states
}
```

### 4. Component ModalImportExcel (src/components/modal/ModalImportExcel.tsx)

#### Quy trình 2 bước

**Bước 1: Upload File**

- User chọn file Excel (.xlsx, .xls)
- Click "Tải file lên server"
- File được upload sử dụng `uploads()` từ fileUtil
- Nhận object IFile với ID

**Bước 2: Import Data**

- Hiển thị các tùy chọn:
  - Xử lý khi có lỗi (SKIP_ERROR hoặc STOP_ON_ERROR)
  - Xử lý khi trùng dữ liệu (UPDATE, SKIP, STOP)
- Click "Nhập dữ liệu"
- Gửi fileId + options đến backend

#### UI/UX Improvements

- Form validation với Radio buttons cho options
- Progress indicators riêng cho upload và import
- Success/error notifications
- Visual feedback khi file đã upload thành công

### 5. API Endpoints (src/constants/ApiEndpoint.ts)

```typescript
excel: {
  export: "/excel/export",
  import: "/excel/import",
  template: "/excel/template/:type",
  validate: "/excel/validate", // Mới thêm
}
```

### 6. Hook useExcelData (src/hooks/core/useExcelData.ts)

Expose thêm loading states:

```typescript
return {
  loading,
  uploadingFile,
  importingData,
  exportCurrentExcel,
  getCurrentTemplate,
  importCurrentExcel,
};
```

## Cách sử dụng

### Import Excel

```tsx
import { ModalImportExcel } from "@/components/modal";
import { ExcelEntityType } from "@/constants/enum";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Import từ Excel</Button>

      <ModalImportExcel
        open={showModal}
        type={ExcelEntityType.PRODUCT}
        setClose={() => setShowModal(false)}
        onSuccess={() => {
          // Refresh data sau khi import thành công
          refetchData();
        }}
      />
    </>
  );
}
```

### Export Excel

```tsx
import { useExcelData } from "@/hooks/core/useExcelData";

function MyComponent() {
  const { exportCurrentExcel, loading } = useExcelData({});

  const handleExport = () => {
    exportCurrentExcel({
      type: ExcelEntityType.PRODUCT,
      filters: {
        // ... your filters
      },
    });
  };

  return (
    <Button onClick={handleExport} loading={loading}>
      Export Excel
    </Button>
  );
}
```

### Get Template

```tsx
import { useExcelData } from "@/hooks/core/useExcelData";

function MyComponent() {
  const { getCurrentTemplate } = useExcelData({});

  const handleDownloadTemplate = () => {
    getCurrentTemplate({
      type: ExcelEntityType.PRODUCT,
      storeId: "optional-store-id",
    });
  };

  return <Button onClick={handleDownloadTemplate}>Tải file mẫu</Button>;
}
```

## Backend Integration

Backend cần implement các endpoints:

### GET /excel/template/:type

- Query params: `storeId`, `filters` (JSON string)
- Response: `{ data: { url, filename, expiresAt } }`

### POST /excel/import

```typescript
Request Body: {
  entityType: ExcelEntityType;
  fileId: string;
  errorHandling: ImportErrorHandling;
  duplicateHandling: ImportDuplicateHandling;
  uniqueFields?: string[];
}

Response: {
  data: {
    totalRows: number;
    successRows: number;
    errorRows: number;
    skippedRows: number;
    errors: ImportError[];
    data?: any[];
  }
}
```

### POST /excel/validate

- Validate file trước khi import
- Request: `{ fileId: string, entityType: ExcelEntityType }`
- Response: `{ valid: boolean, errors: IError[] }`

## Lợi ích của quy trình mới

1. **Tách biệt concerns**: Upload file và import data là 2 bước độc lập
2. **Better error handling**: User có thể chọn cách xử lý lỗi và trùng lặp
3. **File persistence**: File được lưu trên server, có thể validate trước khi import
4. **Improved UX**: Progress indicators riêng cho từng bước
5. **Flexibility**: Có thể mở rộng với các options khác trong tương lai
6. **Type safety**: Full TypeScript support với đầy đủ types

## Migration Guide

Nếu bạn đang sử dụng version cũ, cần cập nhật:

### Trước đây:

```tsx
onSuccess={(file) => {
  // Handle file
}}
```

### Bây giờ:

```tsx
onSuccess={() => {
  // Import đã hoàn tất, refresh data
}}
```

Import result sẽ được hiển thị tự động qua modal ImportResult.

## Notes

- Template files có thời gian hết hạn (1 giờ theo backend)
- File uploads được quản lý qua file service
- Import result được lưu trong Redux state để tracking
- Notifications tự động cho mọi action (upload, import, errors)
