"use client";

import { Button, Form, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import Link from "next/link";
import { server_register } from "@/app/account/action";

export type FieldType = {
  username: string;
  password: string;
  confirm_password: string;
  verifyCode: string;
};

export default function Page() {
  const [messageApi, contextHolder] = message.useMessage();

  async function client_register(data: FieldType) {
    if (data.password !== data.confirm_password) {
      return messageApi.error("两次输入的密码不一致");
    }
    if (!(await server_register(data))) {
      return messageApi.error("注册失败");
    }
    window.location.href = "/account/login";
  }

  return (
    <>
      {contextHolder}
      <div className="relative h-full flex flex-col items-center justify-around">
        <Form
          name="login"
          onFinish={client_register}
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
          <FormItem<FieldType> name="confirm_password" label="确认密码">
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
              注册
            </Button>
          </FormItem>
        </Form>
        <div className="absolute right-[15px] bottom-[15px]">
          已有帐号？
          <Link href="/account/login" className="text-blue-800 underline">
            返回登录
          </Link>
        </div>
      </div>
    </>
  );
}
