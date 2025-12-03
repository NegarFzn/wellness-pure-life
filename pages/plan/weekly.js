import { requirePremium } from "../../middlewares/requirePremium";

export async function getServerSideProps(ctx) {
  return requirePremium(ctx);
}

export default function WeeklyPlanPage() {
  return <div>Weekly Plan Goes Here</div>;
}
