import { Form } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Partner } from "../../partner.model";

export interface PartnerFormPartialProps {
  form: ReturnType<typeof Form.useForm<Partner>>[0];
  editData?: Partner;
}

export type PartnerFormModalProps = AddUpdateModalProps<Partner>;
