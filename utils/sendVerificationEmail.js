export async function handleVerifyEmail(user) {
    if (!user?.email || !user?.uid) {
      alert("Missing user info");
      return;
    }
  
    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, uid: user.uid }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Server error");
      }
  
      const data = await res.json();
      alert(data.message || "📫 Verification email sent!");
    } catch (err) {
      console.error("Verification error:", err);
      alert("❌ Failed to send verification email.");
    }
  }
  