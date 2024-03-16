"use client";
import React, { useEffect, useState } from "react";
import { Layout, Breadcrumb, Menu, type MenuProps } from "antd";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Content, Sider, Header } = Layout;

interface StyledComponentsRegistryProps {
  children: React.ReactNode;
}

const headerMenu: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const sideMenu: MenuProps["items"] = [
  {
    label: "Account",
    icon: UserOutlined,
    rootPath: "/account",
    children: [
      {
        label: "Purchase",
        icon: UserOutlined,
        path: "/purchase",
      },
      {
        label: "Receipt",
        icon: UserOutlined,
        path: "/receipt",
      },
    ],
  },
  {
    label: "Human Resource",
    icon: LaptopOutlined,
  },
  {
    label: "Legal",
    icon: NotificationOutlined,
  },
  {
    label: "Marketing",
    icon: NotificationOutlined,
  },
  {
    label: "Operation",
    icon: NotificationOutlined,
    rootPath: "/operation",
    children: [
      {
        label: "Flow",
        icon: UserOutlined,
        path: "/flow",
      },
    ],
  },
  {
    label: "Executive",
    icon: NotificationOutlined,
  },
].map((item, index) => {
  return {
    key: String(index),
    icon: React.createElement(item.icon),
    label: item.rootPath ? (
      <Link href={item.rootPath}>
        <div>{item.label}</div>
      </Link>
    ) : (
      item.label
    ),
    children: item.children?.map((subItem) => {
      return {
        key: subItem.label,
        label: (
          <Link href={`${item.rootPath}${subItem.path}`}>{subItem.label}</Link>
        ),
      };
    }),
  };
});

const StyledComponentsRegistry: React.FC<StyledComponentsRegistryProps> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState("Home");
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);
  const pathname = usePathname();

  useServerInsertedHTML(() => {
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  useEffect(() => {
    const formatPath = (path: string) => {
      const pathString = path.charAt(0).toUpperCase() + path.slice(1);
      return pathString.replace(/-/g, " ");
    };

    if (pathname) {
      const pathArray = pathname.split("/");
      const page = pathArray[pathArray.length - 1] || "Home";
      setCurrentPage(formatPath(page));
    }
  }, [pathname]);

  const accountItems = [
    {
      path: "/purchase",
      breadcrumbName: "Purchase",
    },
    {
      path: "/receipt",
      breadcrumbName: "Receipt",
    },
  ];

  return (
    <StyleProvider cache={cache}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={headerMenu}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout className="layout">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          // onBreakpoint={(broken) => {
          //   console.log(broken);
          // }}
          // onCollapse={(collapsed, type) => {
          //   console.log(collapsed, type);
          // }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            // defaultSelectedKeys={["4"]}
            items={sideMenu}
          />
        </Sider>
        <Content style={{ padding: "20px 50px" }}>
          <Breadcrumb
            routes={[
              {
                breadcrumbName: "Home",
                href: "/works/EnterpriseXpress/modules/account",
              },
              {
                breadcrumbName: "Account",
                href: "/works/EnterpriseXpress/modules/account",
                children: accountItems,
              },
              {
                breadcrumbName: currentPage,
              },
            ]}
          ></Breadcrumb>
          <div
            style={{
              background: "#fff",
              padding: 24,
              minHeight: "calc(100vh - 90px)",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </StyleProvider>
  );
};

export default StyledComponentsRegistry;
