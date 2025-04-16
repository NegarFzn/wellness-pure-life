export async function saveSubscriber({ name, email }) {
  try {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message,
    };
  } catch (error) {
    console.error("❌ Error in saveSubscriber:", error.message);
    return {
      success: false,
      message: "Subscription failed. Please try again later.",
    };
  }
}
