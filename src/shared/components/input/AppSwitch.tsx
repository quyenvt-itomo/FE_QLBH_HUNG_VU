import { Switch, SwitchProps, theme } from "antd";

export interface AppSwitchProps extends SwitchProps {
  label?: string;
}

export const AppSwitch: React.FC<AppSwitchProps> = ({ checked, onChange, label, ...props }) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: token.controlHeight,
        borderRadius: token.borderRadius,
      }}
      className={`
        flex items-center gap-3 w-full px-3 transition-colors ease-in-out
        ${checked ? "bg-green-200 border-green-400" : "bg-gray-200 border-gray-400"}
      `}
    >
      <Switch checked={checked} onChange={onChange} {...props} />

      {label && (
        <span
          style={{
            fontSize: token.fontSize,
            color: checked ? token.colorPrimary : token.colorTextSecondary,
            cursor: "pointer",
          }}
          onClick={() => onChange?.(!checked, {} as any)}
        >
          {label}
        </span>
      )}
    </div>
  );
};
