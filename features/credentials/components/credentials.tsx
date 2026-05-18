"use client";

import type { Credential } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { ROUTES } from "@/routes";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useCredentialsParams } from "../hooks/use-credentials-params";

/**
 * Search input component for filtering credentials by name.
 * Integrates with URL parameters to persist search state; debounces input by 500ms.
 * Resets pagination to page 1 on search change.
 * 
 * @author Maruf Bepary
 */
export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

/**
 * List component rendering paginated credentials with search results.
 * Uses suspense for data fetching; delegates item rendering to CredentialItem.
 * Shows empty state if no credentials exist or search yields no results.
 * 
 * @author Maruf Bepary
 */
export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

/**
 * Page header component with title, description, and "New credential" button.
 * Button disabled when premium subscription check is pending or user lacks premium tier.
 * Routes to credential creation form on click.
 * 
 * @param disabled - Whether to disable the "New credential" button (e.g., during subscription check).
 * @author Maruf Bepary
 */
export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref={ROUTES.CREDENTIALS.CREATE.path}
      newButtonLabel="New credential"
      disabled={disabled}
    />
  );
};

/**
 * Pagination controls for credentials list (previous/next page, page indicator).
 * Syncs page state with URL parameters; disabled while fetching new page.
 * Calculates total pages from query result metadata.
 * 
 * @author Maruf Bepary
 */
export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

/**
 * Layout wrapper for the credentials list page.
 * Composes header, search, pagination, and list components in proper order.
 * Used in `(dashboard)/credentials/page.tsx` with Suspense boundaries.
 * 
 * @param children - List component to render between header and pagination.
 * @author Maruf Bepary
 */
export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

/**
 * Loading skeleton shown while credentials query is pending.
 * Rendered inside Suspense boundary in credentials list page.
 * 
 * @author Maruf Bepary
 */
export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />;
};

/**
 * Error message shown if credentials query fails (network error, permission denied, etc.).
 * Rendered inside Suspense error boundary in credentials list page.
 * 
 * @author Maruf Bepary
 */
export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

/**
 * Empty state shown when user has no credentials (first-time experience).
 * Displays explanatory message with button to create first credential.
 * 
 * @author Maruf Bepary
 */
export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(ROUTES.CREDENTIALS.CREATE.path);
  };

  return (
    <EmptyView
      onNew={handleCreate}
      message="You haven't created any credentials yet. Get started by creating your first credential"
    />
  );
};

import { getModelProviderLogo } from "../models";

/**
 * List item rendering a single credential with provider logo, name, timestamps, and delete button.
 * Logo fetched from MODEL_PROVIDERS metadata; shows provider branding (OpenAI, Anthropic, etc.).
 * Clicking item navigates to credential detail/edit page; delete button shows confirmation.
 * 
 * @param data - The credential object to render (id, name, type, createdAt, updatedAt).
 * @author Maruf Bepary
 */
export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = getModelProviderLogo(data.type) || "/logos/openai.svg";

  return (
    <EntityItem
      href={ROUTES.CREDENTIALS.DETAIL(data.id).path}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
