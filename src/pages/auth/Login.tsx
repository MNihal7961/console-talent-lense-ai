import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdAlternateEmail, MdLockOutline } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import type { LoginDTO } from "../../types";
import useLogin from "../../hooks/useLogin";
import "./index.scss";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { isLoging, handleLogin } = useLogin();

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <div className="auth-brand">
          <div className="auth-brand-content">
            <div className="auth-brand-header">
              <Typography.Title level={3}>
                TalentLens<span className="text-primary">.ai</span>
              </Typography.Title>
            </div>
            <div className="auth-brand-tag">
              <IoShieldCheckmarkOutline size={18} className="text-primary" />
              <Typography.Text strong>
                Auditable Candidate Intelligence
              </Typography.Text>
            </div>
            <div>
              <Typography.Title level={2}>
                Explainable AI screening for
              </Typography.Title>
              <Typography.Title level={2}>
                technical recruiters.
              </Typography.Title>
            </div>
            <div>
              <Typography.Text type="secondary" className="brand-sub-text">
                Analyze resumes against job requirements with
              </Typography.Text>
              <br />
              <Typography.Text type="secondary" className="brand-sub-text">
                transparent, evidence-backed AI insights.
              </Typography.Text>
            </div>
          </div>
          <div className="auth-brand-footer">
            <FaBalanceScale size={18} className="text-primary" />
            <Typography.Text strong className="text-primary">
              AI recomends; the recruiter decides
            </Typography.Text>
          </div>
        </div>
        <div className="auth-form">
          <div className="auth-form-content">
            <div className="auth-form-mobile-brand">
              <Typography.Title level={3}>
                TalentLens<span className="text-primary">.ai</span>
              </Typography.Title>
            </div>
            <div className="auth-form-header">
              <Typography.Title level={4}>Welcome back</Typography.Title>
              <Typography.Text>
                Sign in to resume candidate assessments and pipeline audits.
              </Typography.Text>
            </div>
            <Form<LoginDTO>
              form={form}
              layout="vertical"
              scrollToFirstError
              requiredMark={false}
              className="auth-form-section"
              onFinish={handleLogin}
            >
              <Form.Item
                label={<Typography.Text strong>Work Email</Typography.Text>}
                name="email"
                rules={[
                  { required: true, message: "Enter your email address." },
                  { type: "email", message: "Enter a valid email address." },
                ]}
                validateFirst
              >
                <Input
                  prefix={<MdAlternateEmail />}
                  size="large"
                  placeholder="recruiter@company.com"
                />
              </Form.Item>
              <Form.Item
                label={<Typography.Text strong>Password</Typography.Text>}
                name="password"
                rules={[{ required: true, message: "Enter your password." }]}
                validateFirst
              >
                <Input.Password
                  prefix={<MdLockOutline />}
                  placeholder="Enter your password."
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoging}
                  icon={<FiArrowRight />}
                  iconPlacement="end"
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className="auth-form-create-account-link">
                <Typography.Text>
                  Don't have an account?{" "}
                  <Link to="/sign-up">Sign up</Link>
                </Typography.Text>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
