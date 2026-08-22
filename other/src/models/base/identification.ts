export interface IdentificationModel {
  id: string; // Số CMND/CCCD
  dob?: string; // Ngày sinh
  issuedDate?: string; // Ngày cấp CMND/CCCD
  expirationDate?: string; // Ngày hết hạn CMND/CCCD
  placeOfIssue?: string; // Nơi cấp CMND/CCCD
  issuedBy?: string; // Cơ quan cấp CMND/CCCD
  files?: string[]; // Danh sách file đính kèm CMND/CCCD
}
