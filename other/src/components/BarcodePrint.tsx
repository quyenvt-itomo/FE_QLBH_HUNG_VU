import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

interface Props {
  code: string;
  name?: string;
}

const BarcodePrint: React.FC<Props> = ({ code, name }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && code) {
      JsBarcode(svgRef.current, code, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 14,
      });
    }
  }, [code]);

  return (
    <div className="barcode-label">
      {name && <div className="product-name">{name}</div>}
      <svg ref={svgRef}></svg>
    </div>
  );
};

interface PrintProps {
  items: { code: string; name: string }[];
}

export const BarcodePrintPage: React.FC<PrintProps> = ({ items }) => {
  useEffect(() => {
    setTimeout(() => window.print(), 300);
  }, []);

  return (
    <div className="print-container">
      {items.map((item, index) => (
        <div className="label" key={index}>
          <BarcodePrint code={item.code} name={item.name} />
        </div>
      ))}
    </div>
  );
};

export default BarcodePrint;
