import { LanguageData } from "../../models/base/format";
import { language_options } from "../../constants/option/language";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

interface LanguageSelectProps extends SelectProps {
  onChangeData?: (data: LanguageData | undefined) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  onChangeData,
  ...rest
}) => {
  const listLanguage: LanguageData[] = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文 (Chinese)" },
    { code: "es", name: "Español (Spanish)" },
    { code: "fr", name: "Français (French)" },
    { code: "ar", name: "العربية (Arabic)" },
    { code: "pt", name: "Português (Portuguese)" },
    { code: "ru", name: "Русский (Russian)" },
    { code: "de", name: "Deutsch (German)" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "ja", name: "日本語 (Japanese)" },
    { code: "ko", name: "한국어 (Korean)" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "th", name: "ภาษาไทย (Thai)" },
    { code: "it", name: "Italiano (Italian)" },
    { code: "tr", name: "Türkçe (Turkish)" },
    { code: "nl", name: "Nederlands (Dutch)" },
    { code: "other", name: "Other" },
  ];

  const handleChange = (value: string) => {
    onChange?.(value);
    const data = listLanguage.find((item) => item.name === value);
    onChangeData?.(data);
  };

  return (
    <Select<string>
      options={language_options}
      value={value}
      onChange={handleChange}
      showSearch
      className="h-8 w-full"
      suffixIcon={<IconArrowDown />}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
      {...rest}
    />
  );
};

export default LanguageSelect;
