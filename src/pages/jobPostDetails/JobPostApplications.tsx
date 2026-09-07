import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Empty,
  Input,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TbEye, TbFileTypePdf } from "react-icons/tb";
import dayjs from "dayjs";
import useJobPostApplications from "../../hooks/useJobPostApplications";
import type { JobPostApplicationRow } from "../../hooks/useJobPostApplications";
import useScreeningStatusUpdates from "../../hooks/useScreeningStatusUpdates";
import {
  JobApplicationStatus,
  ScreeningStatus,
  type JobApplication,
} from "../../interface/job-application";
import { MATCH_STATUS_META } from "../../utils/matchStatus";
import { SCREENING_STATUS_META } from "../../utils/screeningStatus";
import { JOB_APPLICATION_STATUS_META } from "../../utils/jobApplicationStatus";

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS = [
  { label: "Applied", value: JobApplicationStatus.APPLIED },
  { label: "Shortlisted", value: JobApplicationStatus.SHORTLISTED },
  { label: "Rejected", value: JobApplicationStatus.REJECTED },
];

type SortOption = "newest" | "oldest" | "score_desc" | "score_asc";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Highest score", value: "score_desc" },
  { label: "Lowest score", value: "score_asc" },
];

interface JobPostApplicationsProps {
  jobPostId?: string;
}

const JobPostApplications = ({ jobPostId }: JobPostApplicationsProps) => {
  const navigate = useNavigate();
  const { applications, isLoading, reloadApplications } =
    useJobPostApplications(jobPostId);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    JobApplicationStatus | undefined
  >(undefined);
  const [sortOption, setSortOption] = useState<SortOption | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters =
    searchText.trim() !== "" ||
    statusFilter !== undefined ||
    sortOption !== undefined;

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: JobApplicationStatus | undefined) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption | undefined) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setSortOption(undefined);
    setCurrentPage(1);
  };

  const handleScreeningStatusUpdated = useCallback(
    (updatedJobApplication: JobApplication) => {
      if (updatedJobApplication.jobPostId !== jobPostId) return;
      reloadApplications();
    },
    [jobPostId, reloadApplications],
  );

  useScreeningStatusUpdates(handleScreeningStatusUpdated);

  const filteredApplications = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    let result = applications;

    if (search) {
      result = result.filter(
        (row) =>
          row.jobApplication.fileName.toLowerCase().includes(search) ||
          row.jobApplication.candidateName?.toLowerCase().includes(search),
      );
    }

    if (statusFilter) {
      result = result.filter(
        (row) => row.jobApplication.status === statusFilter,
      );
    }

    if (!sortOption) return result;

    return [...result].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            dayjs(b.jobApplication.createdAt).valueOf() -
            dayjs(a.jobApplication.createdAt).valueOf()
          );
        case "oldest":
          return (
            dayjs(a.jobApplication.createdAt).valueOf() -
            dayjs(b.jobApplication.createdAt).valueOf()
          );
        case "score_desc":
          return (
            (b.screeningResult?.matchScore ?? -1) -
            (a.screeningResult?.matchScore ?? -1)
          );
        case "score_asc":
          return (
            (a.screeningResult?.matchScore ?? -1) -
            (b.screeningResult?.matchScore ?? -1)
          );
        default:
          return 0;
      }
    });
  }, [applications, searchText, statusFilter, sortOption]);

  const columns: TableColumnsType<JobPostApplicationRow> = [
    {
      title: "Rank",
      key: "rank",
      width: 70,
      render: (_value, row) => (
        <Typography.Text strong className="job-post-applications-rank">
          {row.rank ? `#${row.rank}` : "-"}
        </Typography.Text>
      ),
    },
    {
      title: "Candidate",
      key: "candidateName",
      width: 180,
      ellipsis: true,
      render: (_value, row) => {
        if (row.jobApplication.candidateName) {
          return row.jobApplication.candidateName;
        }

        const isFailed =
          row.jobApplication.screeningStatus ===
            ScreeningStatus.RESUME_PARSING_FAILED ||
          row.jobApplication.screeningStatus ===
            ScreeningStatus.SCREENING_FAILED;

        return (
          <Typography.Text type="secondary">
            {isFailed ? "-" : "Parsing..."}
          </Typography.Text>
        );
      },
    },
    {
      title: "Uploaded",
      key: "createdAt",
      width: 160,
      render: (_value, row) => (
        <div className="job-post-applications-created-at">
          <Typography.Text>
            {dayjs(row.jobApplication.createdAt)
              .format("DD MMM YYYY")
              .toUpperCase()}
          </Typography.Text>
          <Typography.Text
            type="secondary"
            className="job-post-applications-created-time"
          >
            {dayjs(row.jobApplication.createdAt).format("hh:mm A")}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "File",
      key: "fileName",
      width: 220,
      ellipsis: true,
      render: (_value, row) => (
        <div className="job-post-applications-file">
          <TbFileTypePdf className="job-post-applications-file-icon" />
          <Typography.Text>{row.jobApplication.fileName}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Score",
      key: "matchScore",
      width: 90,
      render: (_value, row) =>
        row.screeningResult ? `${row.screeningResult.matchScore}%` : "-",
    },
    {
      title: "Match Status",
      key: "matchStatus",
      width: 160,
      render: (_value, row) => {
        if (row.screeningResult) {
          const matchMeta = MATCH_STATUS_META[row.screeningResult.matchStatus];
          return <Tag color={matchMeta.color}>{matchMeta.label}</Tag>;
        }

        const statusMeta =
          SCREENING_STATUS_META[row.jobApplication.screeningStatus];
        return (
          <Tag
            color={
              statusMeta.progressStatus === "exception"
                ? "error"
                : "processing"
            }
          >
            {statusMeta.label}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_value, row) => {
        const statusMeta = JOB_APPLICATION_STATUS_META[row.jobApplication.status];
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      render: (_value, row) => (
        <Tooltip title="View screening results">
          <Button
            shape="default"
            icon={<TbEye />}
            disabled={!row.screeningResult}
            onClick={() =>
              navigate(`/screening/result/${row.jobApplication._id}`)
            }
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="job-post-applications">
      <div className="job-post-applications-filters">
        <Input.Search
          className="job-post-applications-search"
          placeholder="Search by candidate or file name"
          allowClear
          value={searchText}
          onChange={(event) => handleSearchChange(event.target.value)}
          enterButton={<Button type="primary">Search</Button>}
        />

        <Select<JobApplicationStatus>
          className="job-post-applications-status-filter"
          placeholder="Filter by status"
          allowClear
          value={statusFilter}
          options={STATUS_FILTER_OPTIONS}
          onChange={(value) => handleStatusFilterChange(value)}
        />

        <Select<SortOption>
          className="job-post-applications-sort"
          placeholder="Sort by"
          allowClear
          value={sortOption}
          options={SORT_OPTIONS}
          onChange={(value) => handleSortChange(value)}
        />

        {hasActiveFilters && (
          <Button onClick={handleClearFilters}>Clear</Button>
        )}
      </div>

      <Table<JobPostApplicationRow>
        bordered
        rowKey={(row) => row.jobApplication._id}
        columns={columns}
        dataSource={filteredApplications}
        loading={{
          spinning: isLoading,
          tip: "Loading applications...",
          indicator: <LoadingOutlined spin />,
        }}
        scroll={{ x: 1100 }}
        locale={{
          emptyText: isLoading ? null : (
            <Empty
              description={
                hasActiveFilters
                  ? "No applications match your filters."
                  : "No applications yet for this job post."
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

export default JobPostApplications;
