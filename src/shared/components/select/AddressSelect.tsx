import { AppSelect } from "./AppSelect";
import { Row, Col, Form, FormInstance, SelectProps, Input, Popover, Button } from "antd";
import { EnvironmentOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Label } from "../display/Label";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { removeVietnameseTones } from "@/shared/utils/search.util";

interface ProvinceSelectProps extends SelectProps {
  onClearWard?: () => void;
}

export const ProvinceSelect: React.FC<ProvinceSelectProps> = ({
  onClearWard,
  onChange,
  ...rest
}) => {
  return (
    <AppSelect
      placeholder="Chọn tỉnh/thành phố"
      filterOption={(input, option) => {
        const keyword = input.toLowerCase();
        const label = removeVietnameseTones(String(option?.label));

        const numberKeyword = Number(keyword);

        // Mặc định: khớp theo label
        return (
          option?.plates?.includes(numberKeyword) || label.includes(removeVietnameseTones(input))
        );
      }}
      onChange={
        onChange
          ? (val, opt) => {
              onChange?.(val, opt);
              onClearWard?.();
            }
          : undefined
      }
      {...rest}
    />
  );
};

export const WardSelect: React.FC<SelectProps> = ({ ...rest }) => {
  return <AppSelect placeholder="Chọn phường/xã" {...rest} />;
};

// Form.Item địa chỉ
interface AddressFormItemProps {
  name: string | number | (string | number)[];
  required?: boolean;
  label?: string;
  layout?: "horizontal" | "vertical";
  form: FormInstance<any>;
  labelWidth?: number;
  labelHeight?: number;
  bold?: boolean;
  parentKey?: string;
  gutter?:
    | number
    | [number, number]
    | {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
      };
}
export const AddressFormItem: React.FC<AddressFormItemProps> = ({
  name,
  required = false,
  label = "Địa chỉ",
  layout = "vertical",
  form,
  labelWidth = 100,
  labelHeight = 32,
  bold = true,
  parentKey,
  gutter = 16,
}) => {
  const stateFieldName = Array.isArray(name) ? [...name, "state"] : [name, "state"];
  const wardFieldName = Array.isArray(name) ? [...name, "ward"] : [name, "ward"];
  const detailFieldName = Array.isArray(name) ? [...name, "detail"] : [name, "detail"];

  const formStateKey = parentKey ? [parentKey, ...stateFieldName] : stateFieldName;
  const formWardKey = parentKey ? [parentKey, ...wardFieldName] : wardFieldName;

  const lngFieldName = Array.isArray(name) ? [...name, "lng"] : [name, "lng"];
  const latFieldName = Array.isArray(name) ? [...name, "lat"] : [name, "lat"];

  const lng = Form.useWatch(parentKey ? [parentKey, ...lngFieldName] : lngFieldName, form);
  const lat = Form.useWatch(parentKey ? [parentKey, ...latFieldName] : latFieldName, form);

  const state = Form.useWatch(formStateKey, form);
  const { provinceOptions, wardOptions } = useAddressSelector(state);

  const hasCoords = lng != null && lat != null;

  const [coordInput, setCoordInput] = useState("");
  const [coordOpen, setCoordOpen] = useState(false);

  const handleOpenCoord = async (open: boolean) => {
    setCoordOpen(open);
    if (open) {
      // Tự động đọc clipboard khi mở popover
      try {
        const clipText = await navigator.clipboard.readText();
        const parsed = parseCoords(clipText);
        if (parsed) {
          setCoordInput(clipText);
        }
      } catch {
        // Không đọc được clipboard (có thể do browser permission)
      }
    } else {
      setCoordInput("");
    }
  };

  const parseCoords = (text: string): { lat: number; lng: number } | null => {
    // Hỗ trợ format: "lat, lng" hoặc "lat,lng" (Google Maps clipboard)
    const parts = text
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return null;
  };

  const handleSaveCoords = () => {
    const parsed = parseCoords(coordInput);
    if (parsed) {
      form.setFieldValue(parentKey ? [parentKey, ...latFieldName] : latFieldName, parsed.lat);
      form.setFieldValue(parentKey ? [parentKey, ...lngFieldName] : lngFieldName, parsed.lng);
      setCoordOpen(false);
      setCoordInput("");
    }
  };

  const mapUrl = hasCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : null;

  return (
    <div
      className={`
      flex ${layout === "horizontal" ? "flex-col md:flex-row items-center gap-4" : "flex-col"}
    `}
    >
      <Label
        title={label}
        required={required}
        width={layout === "horizontal" ? labelWidth : 250}
        height={layout === "horizontal" ? labelHeight : 24}
        bold={bold}
      />
      <Row gutter={gutter}>
        <Col xs={24} sm={12}>
          <Form.Item
            name={stateFieldName}
            rules={
              required ? [{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }] : undefined
            }
          >
            <ProvinceSelect
              options={provinceOptions}
              onChange={(value) => {
                form.setFieldValue(formWardKey, undefined);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={wardFieldName}
            rules={required ? [{ required: true, message: "Vui lòng chọn phường/xã" }] : undefined}
          >
            <WardSelect options={wardOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
          <Form.Item name={detailFieldName}>
            <Input placeholder="Số nhà, đường..." />
          </Form.Item>
        </Col>

        {/* Tọa độ GPS */}
        <Col xs={24}>
          <div className="flex items-center gap-2">
            <Popover
              open={coordOpen}
              onOpenChange={handleOpenCoord}
              trigger="click"
              title="Tọa độ Google Maps"
              content={
                <div className="w-64 flex flex-col gap-2">
                  <Input.TextArea
                    rows={2}
                    placeholder="Dán hoặc tự động lấy từ clipboard"
                    value={coordInput}
                    onChange={(e) => setCoordInput(e.target.value)}
                  />
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleSaveCoords}
                    disabled={!parseCoords(coordInput)}
                  >
                    Lưu tọa độ
                  </Button>
                </div>
              }
            >
              <Button
                size="small"
                type="text"
                icon={
                  hasCoords ? (
                    <EditOutlined className="text-blue-500" />
                  ) : (
                    <EnvironmentOutlined className="text-gray-400" />
                  )
                }
              >
                {hasCoords ? `${lat}, ${lng}` : "Thêm tọa độ GPS"}
              </Button>
            </Popover>
          </div>
        </Col>

        {/* Google Maps preview */}
        {hasCoords && (
          <Col xs={24}>
            <iframe
              title="map"
              src={mapUrl!}
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: 8 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Col>
        )}

        <Form.Item name={lngFieldName} hidden />
        <Form.Item name={latFieldName} hidden />
      </Row>
    </div>
  );
};
