// src/stores/useOrgStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Organization, OrganizationMember, UserRole } from "@/types/database";

interface OrgState {
  currentOrg: Organization | null;
  currentMember: OrganizationMember | null;
  organizations: Organization[];
  setCurrentOrg: (org: Organization, member: OrganizationMember) => void;
  setOrganizations: (orgs: Organization[]) => void;
  clearOrg: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  setDemoRole: (role: UserRole) => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set, get) => ({
      currentOrg: null,
      currentMember: null,
      organizations: [],
      setCurrentOrg: (org, member) => set({ currentOrg: org, currentMember: member }),
      setOrganizations: (organizations) => set({ organizations }),
      clearOrg: () => set({ currentOrg: null, currentMember: null, organizations: [] }),
      hasRole: (roles) => {
        const { currentMember } = get();
        if (!currentMember) return false;
        return roles.includes(currentMember.role);
      },
      setDemoRole: (role) => {
        const { currentMember } = get();
        if (currentMember) {
          set({ currentMember: { ...currentMember, role } });
        } else {
          // If no member exists yet (e.g. just logged in with demo mode), create a mock one
          set({
            currentMember: {
              id: "demo-member",
              organization_id: "demo-org",
              user_id: "demo-user",
              role: role,
              is_active: true,
              invited_at: new Date().toISOString(),
              joined_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }
          });
        }
      },
    }),
    {
      name: "umkm-org-store",
      partialize: (state) => ({
        currentOrg: state.currentOrg,
        currentMember: state.currentMember,
      }),
    }
  )
);
