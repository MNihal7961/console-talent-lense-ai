import { Breadcrumb } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./PageBreadcrumb.scss";

export interface PageBreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBreadcrumbProps {
  items: PageBreadcrumbItem[];
  cta?: ReactNode;
}

const PageBreadcrumb = ({ items, cta }: PageBreadcrumbProps) => {
  return (
    <div className="page-breadcrumb">
      <Breadcrumb
        items={items.map((item) => ({
          title: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
        }))}
      />

      {cta && <div className="page-breadcrumb-cta">{cta}</div>}
    </div>
  );
};

export default PageBreadcrumb;
