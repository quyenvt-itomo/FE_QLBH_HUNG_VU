import { Switch, SwitchProps, theme } from "antd";

export interface AppSwitchProps extends SwitchProps {
  label?: string;
}

export const AppSwitch: React.FC<AppSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled,
  ...props
}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: token.controlHeight,
        borderRadius: token.borderRadius,
      }}
      className={`
        flex items-center gap-3 w-full px-3 transition-colors ease-in-out border
      `}
    >
      <Switch checked={checked} onChange={onChange} disabled={disabled} {...props} />

      {label && (
        <span
          style={{
            fontSize: token.fontSize,
            color: checked ? token.colorPrimary : token.colorTextSecondary,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onClick={() => !disabled && onChange?.(!checked, {} as any)}
        >
          {label}
        </span>
      )}
    </div>
  );
};
