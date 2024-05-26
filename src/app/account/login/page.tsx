"use client";
import { Form, Input, Button, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import Link from "next/link";
import { server_login } from "@/app/account/action";
import { usePathname } from "next/navigation";

export type FieldType = {
  username: string;
  password: string;
  verifyCode: string;
};

export default function Page() {
  const path = usePathname();
  const redirect = new URLSearchParams(path).get("redirect");
  const [messageApi, contextHolder] = message.useMessage();
  let url: string;
  if (redirect === null) {
    url = "/";
  } else {
    url = decodeURIComponent(redirect);
  }

  async function client_login(data: FieldType) {
    if (await server_login(data)) {
      window.location.href = url;
    } else {
      messageApi.error("帐号或密码错误");
    }
  }

  return (
    <>
      {contextHolder}
      <div className="relative h-full flex flex-col items-center justify-around">
        <Form
          name="login"
          onFinish={client_login}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          <FormItem<FieldType>
            name="username"
            label="用户名"
            labelAlign="right"
          >
            <Input style={{ width: 280 }} placeholder="请输入用户名" />
          </FormItem>
          <FormItem<FieldType> name="password" label="密码">
            <Input style={{ width: 280 }} placeholder="请输入密码" />
          </FormItem>
          <FormItem<FieldType> name="verifyCode" label="验证码">
            <Input style={{ width: 280 }} placeholder="请输入验证码" />
          </FormItem>
          <FormItem<FieldType> wrapperCol={{ offset: 8 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{ width: 120 }}
              size="large"
            >
              登录
            </Button>
          </FormItem>
        </Form>
        <div className="absolute right-[15px] bottom-[15px]">
          没有帐号？
          <Link href="/account/register" className="text-blue-800 underline">
            点击注册
          </Link>
        </div>
      </div>
    </>
  );
}
