import React from "react";
import { Card, List, Progress, Typography } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatMoney } from "../../../../utils/formatNumber";

const { Text } = Typography;

interface CategoryStats {
  id: string;
  name: string;
  revenue: number;
  percentage: number;
  growth: number;
}

interface CategoryChartProps {
  data: CategoryStats[];
}

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <Card title="Doanh thu theo danh mục" bordered={false} style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data as any[]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="revenue"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number | undefined) => (value ? formatMoney(value) : "")} />
        </PieChart>
      </ResponsiveContainer>

      <List
        style={{ marginTop: 16 }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item style={{ padding: "8px 0", border: "none" }}>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text strong>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: 8,
                      borderRadius: 2,
                    }}
                  />
                  {item.name}
                </Text>
                <Text type="secondary">{item.percentage}%</Text>
              </div>
              <Progress
                percent={item.percentage}
                strokeColor={COLORS[index % COLORS.length]}
                showInfo={false}
                size="small"
              />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};
