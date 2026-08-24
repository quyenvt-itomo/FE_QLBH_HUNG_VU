import { MultipleSelectProps } from "@/shared/interfaces/common";
import { Organization, OrganizationQuery } from "../organization.model";
import { useOrganizationStore } from "../organization.store";
import { DropdownColumn } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { SmartMultipleSelect } from "@/shared";
import { organizationTypeMap } from "../organization.enum";
