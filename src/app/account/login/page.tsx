"use client";
import { Button, Form, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import Link from "next/link";
import { server_login } from "@/app/account/action";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import useRecaptcha from "@/app/account/recaptcha";

export type FieldType = {
  username: string;
  password: string;
};

export default function Page() {
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const [messageApi, contextHolder] = message.useMessage();
  const [token, refreshRecaptcha, ReCaptcha] = useRecaptcha();
  let url = decodeURIComponent(redirect ?? "/");

  async function client_login(data: FieldType) {
    if (token === "") {
      refreshRecaptcha();
      messageApi.warning("未完成RECAPTCHA，请重试");
      return;
    }
    if (await server_login(data, token)) {
      window.location.href = url;
    } else {
      refreshRecaptcha();
      messageApi.error("帐号或密码错误");
    }
  }

  return (
    <>
      {contextHolder}
      <ReCaptcha />
      <div className="relative h-full flex flex-col items-center justify-around">
        <Form
          name="login"
          onFinish={client_login}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          size="large"
        >
          <FormItem<FieldType>
            name="username"
            label="用户名"
            labelAlign="right"
          >
            <Input
              name="username"
              style={{ width: 280 }}
              placeholder="请输入用户名"
            />
          </FormItem>
          <FormItem<FieldType> name="password" label="密码">
            <Input.Password
              name="password"
              style={{ width: 280 }}
              placeholder="请输入密码"
            />
          </FormItem>
          <span className="text-gray-500 w-[300px] block text-sm mx-auto mb-[20px]">
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy">Privacy Policy</a>
            and
            <a href="https://policies.google.com/terms">Terms of Service</a>
            apply.
          </span>
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
