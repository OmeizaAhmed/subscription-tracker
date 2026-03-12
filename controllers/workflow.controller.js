import { serve } from "@upstash/workflow/express";
import Subscription from "../model/subscription.model";
import dayjs from "dayjs";

const REMINDER = [ 7, 5, 2, 1 ]; // Days before renewal to send reminders
export const sendReminder = serve(async (context) => {
  // Your workflow logic here
  const { subscritionId } = context.requestPayload;
  const subscription = await fetchSubcription(context, subscritionId);

  if(!subscription || subscription.status !== "active")return 

  const renewalDate = dayjs(subscription.renewalDate);
  // Check if the subscription is due for renewal
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscription._id}. Stopping workflow.`);
    return;
  }

  for(const daysBefore of REMINDER){
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if(reminderDate.isAfter(dayjs())){
      // Schedule a reminder
      await sleepUntilReminder(context, `Reminder ${daysBefore}days before`, reminderDate);
    }

    await triggerReminder(context, `Reminder ${daysBefore}days before`); 

  }
});

const fetchSubcription = async (context, subscriptionId) => {
  // Fetch subscription details from your database
  // You can use context to access any necessary information or services
  return await context.run("getSubscriptionDetails", async() => {
    return await Subscription.findById(subscriptionId).populate("user", "email name");
  });
};


const sleepUntilReminder = async (context, label, date ) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(date.toDate());
}

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);

    // send email logic here using subscription details from context
  })
}