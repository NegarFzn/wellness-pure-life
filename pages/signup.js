import Signup from "../components/Auth/Signup";

export default function SignupPage() {
  return <Signup isOpen={true} onClose={() => window.history.back()} />;
}
