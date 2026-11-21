import Account from "@/components/account/account";
import PageHeading from "@/components/common/page-heading";
export default function ProfilePage() {
  return (
    <>
      <PageHeading
        title="My Account"
        description="Manage your addresses and account settings"
        kind="account"
      />
      <Account />
    </>
  );
}
