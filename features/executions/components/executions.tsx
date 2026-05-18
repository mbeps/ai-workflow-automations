"use client";

/**
 * Execution list page components.
 * Provides header, list, pagination, and empty state views for browsing workflow executions.
 * Uses entity component patterns for consistent layout and behavior.
 *
 * @author Maruf Bepary
 */

import type { Execution } from "@prisma/client";
import { ExecutionStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { ROUTES } from "@/routes";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";

/**
 * Renders paginated list of execution items with fallback for empty state.
 * Fetches all executions via suspense query.
 *
 * @returns Execution list component
 */
export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

/**
 * Renders the page header with title and description.
 *
 * @returns Header component
 */
export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow execution history"
    />
  );
};

/**
 * Renders pagination controls bound to URL parameters.
 * Syncs page changes back to query string for bookmarkable state.
 *
 * @returns Pagination component
 */
export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

/**
 * Wrapper component combining header and pagination with list content.
 * Provides consistent container layout for the executions list page.
 *
 * @param children - Content to render between header and pagination
 * @returns Container component
 */
export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

/**
 * Loading state component shown while executions are being fetched.
 *
 * @returns Loading view component
 */
export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions..." />;
};

/**
 * Error state component shown when execution fetch fails.
 *
 * @returns Error view component
 */
export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions" />;
};

/**
 * Empty state component shown when user has no executions.
 *
 * @returns Empty view component
 */
export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="You haven't created any executions yet. Get started by running your first workflow" />
  );
};

/**
 * Returns a Lucide icon component matching the execution status.
 *
 * @param status - Execution status value
 * @returns Icon component with appropriate color and animation
 */
const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000,
      )
    : null;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s </>}
    </>
  );

  return (
    <EntityItem
      href={ROUTES.EXECUTIONS.DETAIL(data.id).path}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
