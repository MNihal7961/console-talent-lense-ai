import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Input, Select, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useJobPosts from "../../hooks/useJobPosts";
import type { JobPost as JobPostType } from "../../interface/job-post";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import "./index.scss";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { label: "Newest first", value: "desc" },
  { label: "Oldest first", value: "asc" },
];

const JobPost = () => {
  const { jobPosts, isJobPostLoading } = useJobPosts();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters = searchText.trim() !== "" || sortOrder !== undefined;

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: "asc" | "desc" | undefined) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSortOrder(undefined);
    setCurrentPage(1);
  };

  const filteredJobPosts = useMemo(() => {
    const search = searchText.trim();
    let result = jobPosts;

    if (search) {
      try {
        const searchRegex = new RegExp(search, "i");
        result = result.filter(
          (jobPost) =>
            searchRegex.test(jobPost.title ?? "") ||
            searchRegex.test(jobPost.description ?? ""),
        );
      } catch {
        const lowerSearch = search.toLowerCase();
        result = result.filter(
          (jobPost) =>
            jobPost.title?.toLowerCase().includes(lowerSearch) ||
            jobPost.description?.toLowerCase().includes(lowerSearch),
        );
      }
    }

    if (!sortOrder) return result;

    return [...result].sort((a, b) => {
      const diff = dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [jobPosts, searchText, sortOrder]);

  const columns: TableColumnsType<JobPostType> = [
    {
      title: "No",
      key: "no",
      width: 64,
      render: (_value, _record, index) =>
        (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt: string) => (
        <div className="job-post-created-at">
          <Typography.Text>
            {dayjs(createdAt).format("DD MMM YYYY").toUpperCase()}
          </Typography.Text>
          <Typography.Text type="secondary" className="job-post-created-time">
            {dayjs(createdAt).format("hh:mm A")}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 220,
      ellipsis: true,
      render: (title: string) => <Typography.Text>{title}</Typography.Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <Typography.Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          className="job-post-description"
        >
          {description}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      render: (_value, record) => (
        <Button type="link" onClick={() => navigate(`/job-post/${record._id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="job-post-page">
      <PageBreadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Job Posts" }]}
        cta={
          <Button type="primary" onClick={() => navigate("/job-post/generate")}>
            Add New Job Post
          </Button>
        }
      />

      <div className="job-post-filters">
        <Input.Search
          className="job-post-search"
          placeholder="Search by title or description"
          allowClear
          value={searchText}
          onChange={(event) => handleSearchChange(event.target.value)}
          enterButton={<Button type="primary">Search</Button>}
        />

        <Select<"asc" | "desc">
          className="job-post-sort"
          placeholder="Sort by"
          allowClear
          value={sortOrder}
          options={SORT_OPTIONS}
          onChange={(value) => handleSortChange(value)}
        />

        {hasActiveFilters && (
          <Button onClick={handleClearFilters}>Clear</Button>
        )}
      </div>

      <Table<JobPostType>
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={filteredJobPosts}
        loading={{
          spinning: isJobPostLoading,
          tip: "Loading job posts...",
          indicator: <LoadingOutlined spin />,
        }}
        scroll={{ x: 900 }}
        locale={{
          emptyText: isJobPostLoading ? null : (
            <Empty
              description={
                hasActiveFilters
                  ? "No job posts match your search."
                  : "No job posts found."
              }
            />
          ),
        }}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default JobPost;
