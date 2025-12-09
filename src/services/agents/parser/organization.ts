import { Organization } from "@core";

export const parseOrganization = ({
  role,
  roleDescription,
  hierarchyWeight,
  subGroups,
}: Organization) => {
  let result = "## Organizational information\n";

  if (role) result += `### Professional occupational role: ${role}\n\n`;
  if (roleDescription) result += `**Role description**: ${roleDescription}\n`;

  return result + "\n\n";
};
