import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { FaBalanceScale } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdAlternateEmail, MdLockOutline } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import "./index.scss";

const Register: React.FC = () => {
  const [form] = Form.useForm();

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
              <Typography.Title level={4}>Create your account</Typography.Title>
              <Typography.Text>
                Start screening technical talent with verifiable candidate
                evidence.
              </Typography.Text>
            </div>
            <Form
              form={form}
              layout="vertical"
              scrollToFirstError
              requiredMark={false}
              className="auth-form-section"
            >
              <div className="auth-form-2-col">
                <Form.Item
                  label={<Typography.Text strong>First Name</Typography.Text>}
                  name="firstName"
                  rules={[
                    { required: true, message: "Enter your first name." },
                  ]}
                  validateFirst
                >
                  <Input size="large" placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  label={<Typography.Text strong>Last Name</Typography.Text>}
                  name="lastName"
                  rules={[
                    { required: true, message: "Enter your last name." },
                  ]}
                  validateFirst
                >
                  <Input size="large" placeholder="Last Name" />
                </Form.Item>
              </div>
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
              <Form.Item
                label={
                  <Typography.Text strong>Confirm Password</Typography.Text>
                }
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirm your password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match.")
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input.Password
                  prefix={<MdLockOutline />}
                  placeholder="Re-enter your password."
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  block
                  icon={<FiArrowRight />}
                  iconPlacement="end"
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className="auth-form-create-account-link">
                <Typography.Text>
                  Already have an account?
                  <Typography.Link href="/sign-in">Sign in</Typography.Link>
                </Typography.Text>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
