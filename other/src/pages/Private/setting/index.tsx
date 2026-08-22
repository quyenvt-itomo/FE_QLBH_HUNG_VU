import { Col, Form, Input, Row, Typography } from "antd";
import { formatCurrency, formatNumber } from "../../../utils/formatNumber";
import { CurrencyData, DateFormatData, TimeFormatData } from "../../../models/base/format";
import dayjs from "dayjs";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { setFormErrors } from "../../../utils/formUtils";
import { getSetting, updateSetting } from "../../../stores/auth/slice";
import SubmitFormButton from "../../../components/button/SubmitFormButton";
import CountrySelect from "../../../components/core/CountrySelect";
import Label from "../../../components/display/Label";
import LanguageSelect from "../../../components/core/LanguageSelect";
import TimezoneSelect from "../../../components/core/TimezoneSelect";
import DateFormatSelect from "../../../components/core/DateFormatSelect";
import TimeFormatSelect from "../../../components/core/TimeFormatSelect";
import TimeDisplayModeSelect from "../../../components/core/TimeDisplayModeSelect";
import NumberFormatSelect from "../../../components/core/NumberFormatSelect";
import DecimalPrecisionSelect from "../../../components/core/DecimalPrecisionSelect";
import SymbolPositionSelect from "../../../components/core/SymbolPositionSelect";
const { Title } = Typography;

const Format: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { settingData, errors, loading } = useSelector(
    (state: RootState) => state.Auth,
    shallowEqual,
  );

  // TODO: Định dạng ngày giờ
  const dateFormat: DateFormatData | undefined = Form.useWatch("dateFormat", form);
  const timeFormat: TimeFormatData | undefined = Form.useWatch("timeFormat", form);
  const dateTime = !!dateFormat && !!timeFormat && dayjs().format(`${dateFormat} ${timeFormat}`);

  // TODO: Định dạng số
  const { decimalPrecision, decimalSeparator, thousandSeparator } =
    Form.useWatch("numberFormat", form) || {};

  const numberFormat =
    decimalPrecision !== undefined &&
    !!decimalSeparator &&
    !!thousandSeparator &&
    formatNumber(100000.0, decimalPrecision, thousandSeparator, decimalSeparator);

  // TODO: Định dạng tiền tệ
  const currency: CurrencyData | undefined = Form.useWatch("currency", form);

  const currencyFormat =
    currency?.symbolPosition !== undefined &&
    currency?.decimalPrecision !== undefined &&
    decimalSeparator !== undefined &&
    thousandSeparator !== undefined &&
    formatCurrency(
      100000,
      currency.decimalPrecision,
      thousandSeparator,
      decimalSeparator,
      currency.symbolPosition,
    );

  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  useEffect(() => {
    if (!settingData) return;
    form.setFieldsValue(settingData);
  }, [settingData, form]);

  useEffect(() => {
    if (!errors) return;

    setFormErrors(form, errors);
  }, [errors, form]);

  const handleSubmit = async (values: any) => {
    const updatedFormat = {
      ...values,
    };
    dispatch(updateSetting(updatedFormat));
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        country: { name: "Việt Nam", code: "VN", phoneCode: "+84" },
        language: { name: "Tiếng Việt", code: "VI" },
        timezone: {
          name: "Asia/Ho_Chi_Minh",
          code: "+07:00",
          offset: "+07:00",
        },
        currency: {
          name: "Việt Nam Đồng (₫)",
          code: "VNĐ",
          symbol: "₫",
          spaceBetween: false,
        },
      }}
      className="h-full flex-col overflow-y-auto scrollbar-hide pb-4"
    >
      <div className="flex flex-col w-full sticky top-0 z-10">
        <div className="flex items-center justify-between bg-[#f8f9fd]">
          <div className="flex gap-3 items-center">
            <Title
              level={5}
              style={{
                fontSize: "1rem",
                marginBottom: 0,
                lineHeight: "1.2rem",
                fontWeight: 500,
              }}
            >
              Định dạng
            </Title>
          </div>
          <SubmitFormButton title="Cập nhật" loading={loading} />
        </div>
        <div className="flex w-full h-4 bg-gradient-to-t from-transparent to-[#f8f9fd]"></div>
      </div>

      <div className="flex flex-col gap-6" style={{ height: "calc(100% - 3rem)" }}>
        {/* Info */}
        <Row gutter={96} className="flex xl:space-y-0 space-y-8">
          <Col xs={24} xl={12}>
            <div className="h-8 flex items-center bg-[#f2f2f2] p-3 font-normal">Vùng miền</div>
            <div className="flex flex-col pt-6 pl-3">
              <Form.Item
                name={["country", "name"]}
                label={<Label title="Quốc gia" required />}
                // rules={[
                //   { required: true, message: "Vui lòng chọn quốc gia!" },
                // ]}
              >
                <CountrySelect
                  disabled
                  onChangeData={(value) => form.setFieldValue("country", value)}
                />
              </Form.Item>
              <Form.Item name="country" hidden />
              {/* language */}
              <Form.Item name={["language", "name"]} label={<Label title="Ngôn ngữ" required />}>
                <LanguageSelect
                  disabled
                  onChangeData={(value) => form.setFieldValue("language", value)}
                />
              </Form.Item>
              <Form.Item name="language" hidden />
              {/* Timezone */}
              <Form.Item name={["timezone", "name"]} label={<Label title="Múi giờ" required />}>
                <TimezoneSelect onChangeData={(value) => form.setFieldValue("timezone", value)} />
              </Form.Item>
              <Form.Item name="timezone" hidden />
            </div>
          </Col>

          <Col xs={24} xl={12} className="space-y-4">
            <div className="flex flex-col">
              <div className="h-8 flex items-center bg-[#f2f2f2] p-3 justify-between font-normal">
                Định dạng ngày giờ
                <span className="text-primary">
                  <span className="">Xem trước: </span>
                  {dateTime}
                </span>
              </div>
              <div className="flex flex-col pt-6 pl-3">
                <Form.Item
                  name="dateFormat"
                  label={<Label title="Ngày" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn định dạng ngày!",
                    },
                  ]}
                >
                  <DateFormatSelect />
                </Form.Item>
                {/* time */}
                <Form.Item
                  name="timeFormat"
                  label={<Label title="Giờ" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn định dạng giờ!",
                    },
                  ]}
                >
                  <TimeFormatSelect />
                </Form.Item>
                {/* timeDisplayMode */}
                <Form.Item
                  name="timeDisplayMode"
                  label={<Label title="Hiển thị giờ" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chế độ hiển thị giờ!",
                    },
                  ]}
                >
                  <TimeDisplayModeSelect />
                </Form.Item>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="h-8 flex items-center bg-[#f2f2f2] p-3 justify-between font-normal">
                Định dạng số
                <span className="text-primary">
                  <span className="">Xem trước: </span>
                  {numberFormat}
                </span>
              </div>
              <div className="flex flex-col pt-6 pl-3">
                <Form.Item
                  name={["numberFormat", "thousandSeparator"]}
                  label={<Label title="Ký hiệu phân tách" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng ký hiệu!",
                    },
                  ]}
                >
                  <NumberFormatSelect
                    onChange={(value) => {
                      form.setFieldValue("numberFormat", {
                        thousandSeparator: value,
                        decimalSeparator: value === "." ? "," : ".",
                        decimalPrecision,
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item name={["numberFormat", "decimalSeparator"]} hidden />
                {/* decimalPrecision */}
                <Form.Item
                  name={["numberFormat", "decimalPrecision"]}
                  label={<Label title="Số chữ số thập phân" required />}
                >
                  <DecimalPrecisionSelect />
                </Form.Item>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="h-8 flex items-center bg-[#f2f2f2] p-3 justify-between font-normal">
                Định dạng tiền tệ
                <span className="text-primary">
                  <span className="">Xem trước: </span>
                  {currencyFormat}
                </span>
              </div>
              <div className="flex flex-col pt-6 pl-3">
                <Form.Item name="currency" hidden />
                <Form.Item
                  name={["currency", "name"]}
                  label={<Label title="Loại tiền" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng ký hiệu!",
                    },
                  ]}
                >
                  <Input className="h-8" disabled />
                </Form.Item>
                {/* decimalPrecision */}
                <Form.Item
                  name={["currency", "decimalPrecision"]}
                  label={<Label title="Số chữ số thập phân" required />}
                >
                  <DecimalPrecisionSelect />
                </Form.Item>
                <Form.Item
                  name={["currency", "symbolPosition"]}
                  label={<Label title="Vị trí ký hiệu" required />}
                >
                  <SymbolPositionSelect />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default Format;
