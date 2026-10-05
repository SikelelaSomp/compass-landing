import { supabase } from "./supabase";

export type Interest = "use" | "watching";
export type Method = "email" | "whatsapp" | "phone";
export type BestTime = "mornings" | "afternoons" | "evenings" | "weekends";

export async function submitInterest(input: {
  name: string;
  email: string;
  phone: string;
  role: string;
  interest: Interest;
  consent: boolean;
}): Promise<string> {
  const { data, error } = await supabase.rpc("submit_interest", {
    p_name: input.name,
    p_email: input.email,
    p_phone: input.phone || null,
    p_role: input.role,
    p_interest: input.interest,
    p_consent: input.consent,
  });
  if (error) throw error;
  return data as string;
}

export async function submitFollowup(
  id: string,
  input: {
    wantsToTalk: boolean;
    method: Method | null;
    time: BestTime | null;
    decision: string;
    phone: string | null;
  },
): Promise<void> {
  const { error } = await supabase.rpc("submit_followup", {
    p_id: id,
    p_wants_to_talk: input.wantsToTalk,
    p_contact_method: input.method,
    p_best_time: input.time,
    p_decision: input.decision || null,
    p_phone: input.phone,
  });
  if (error) throw error;
}