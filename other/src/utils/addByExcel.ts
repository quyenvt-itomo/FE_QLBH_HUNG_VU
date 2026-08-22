export async function addByExcel(
  url: string,
  formData: FormData,
): Promise<any> {
  try {
    // Lấy danh sách các file từ formData
    const file = formData.get("file") as File | null;
    if (!file) {
      throw new Error("No file provided");
    }

    // Kiểm tra loại MIME hoặc phần mở rộng
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (
      !validMimeTypes.includes(file.type) &&
      !file.name.match(/\.xlsx?$|\.xls?$/)
    ) {
      throw new Error("Invalid file type. Please upload an Excel file.");
    }

    const response: Response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        // Không đặt Content-Type, trình duyệt sẽ tự động thêm multipart/form-data
      },
    });

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
