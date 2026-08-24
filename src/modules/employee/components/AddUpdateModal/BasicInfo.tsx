import { Form, Input } from "antd";
import { AddUpdateModalPartialProps } from ".";
import { Label } from "@/shared";
import { Gender, genderOptions, maritalStatusOptions } from "@/shared/constants/enum";
import { ethnicityOptions } from "@/shared/constants/option/ethnicity";
import { getTaxCodeRules } from "@/shared/constants/formItemRule";
import { religionOptions } from "@/shared/constants/option/religion";
import { CLASSNAME } from "@/shared/constants/ui";
import { DatePickerCustom } from "@/shared";
import { IdentityInput } from "@/shared";
import { PartialPanel, PartialTitle } from "./PartialComponent";
import { CustomSelect } from "@/shared";

export const BasicInfo: React.FC<AddUpdateModalPartialProps> = ({ form, id }) => {
  return (
    <>
      <PartialTitle id="basic-info" title="Thông tin cơ bản" />

      <PartialPanel id="personal-info" title="Thông tin cá nhân">
        <Form.Item
          name="code"
          label={<Label title="Mã nhân sự" required />}
          rules={[{ required: true, message: "Vui lòng nhập mã nhân sự" }]}
        >
          <Input className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item
          name="name"
          label={<Label title="Tên nhân sự" required />}
          rules={[{ required: true, message: "Vui lòng nhập tên nhân sự" }]}
        >
          <Input className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item
          name="gender"
          label={<Label title="Giới tính" required />}
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          initialValue={Gender.MALE}
        >
          <CustomSelect options={genderOptions} />
        </Form.Item>
        <Form.Item name="dob" label={<Label title="Ngày sinh" />}>
          <DatePickerCustom onlyDate />
        </Form.Item>
        <Form.Item name="maritalStatus" label={<Label title="Tình trạng hôn nhân" />}>
          <CustomSelect options={maritalStatusOptions} />
        </Form.Item>
        <Form.Item
          name="taxCode"
          label={<Label title="Mã số thuế cá nhân" />}
          rules={getTaxCodeRules()}
        >
          <Input className={CLASSNAME.inputHeight} />
        </Form.Item>

        <Form.Item name="ethnicity" label={<Label title="Dân tộc" />}>
          <CustomSelect options={ethnicityOptions} />
        </Form.Item>

        <Form.Item name="religion" label={<Label title="Tôn giáo" />}>
          <CustomSelect options={religionOptions} />
        </Form.Item>
      </PartialPanel>

      <PartialPanel id="identity-info" title="Thông tin định danh">
        <Form.Item label={<Label title="Số định danh" required />}>
          <IdentityInput
            form={form}
            nameNumber={["identification", "identityCode"]}
            nameType={["identification", "type"]}
          />
        </Form.Item>
        <Form.Item name={["identification", "issuedDate"]} label={<Label title="Ngày cấp" />}>
          <DatePickerCustom onlyDate />
        </Form.Item>
        <Form.Item name={["identification", "issuedPlace"]} label={<Label title="Nơi cấp" />}>
          <Input placeholder="CỤC TRƯỞNG CỤC CẢNH SÁT ..." className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name={["identification", "expiredDate"]} label={<Label title="Ngày hết hạn" />}>
          <DatePickerCustom onlyDate />
        </Form.Item>
      </PartialPanel>

      <PartialPanel id="education-info" title="Trình độ - Bằng cấp">
        <Form.Item
          name={["education", "educationLevel"]}
          label={<Label title="Trình độ văn hóa" />}
        >
          <Input placeholder="12/12" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name={["education", "trainingLevel"]} label={<Label title="Trình độ đào tạo" />}>
          <Input placeholder="Trung cấp, Cao đẳng, Đại học" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name={["education", "institution"]} label={<Label title="Trường tốt nghiệp" />}>
          <Input placeholder="ĐH Bách Khoa Hà Nội" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name={["education", "faculty"]} label={<Label title="Khoa" />}>
          <Input placeholder="Cơ khí" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item name={["education", "major"]} label={<Label title="Chuyên ngành" />}>
          <Input placeholder="Cơ điện tử" className={CLASSNAME.inputHeight} />
        </Form.Item>
        <Form.Item label={<Label title="Hình ảnh, tài liệu" />} className="row-span-2">
          <div className="border border-gray-300 p-3 flex justify-center items-center h-[100px] rounded-[3px]"></div>
        </Form.Item>
        <Form.Item name={["education", "graduationYear"]} label={<Label title="Năm tốt nghiệp" />}>
          <DatePickerCustom />
        </Form.Item>
      </PartialPanel>
    </>
  );
};
