import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Simulation } from "../../../core";
import { supabase } from "../../../core/supabase";

export const getSimulation = async (
  simulationId: string
): Promise<Simulation> => {
  const { data: simulation, error }: PostgrestSingleResponse<Simulation> =
    await supabase
      .from(process.env.SIMULATIONS_TABLE_NAME as string)
      .select("*")
      .eq("id", simulationId)
      .single();

  if (error) throw new Error(error.message);

  return simulation;
};

export const updateSimulationState = async (
  simulationId: string,
  state: "primed" | "running" | "ended" | "stopped"
): Promise<Simulation> => {
  const { data: simulation, error }: PostgrestSingleResponse<Simulation> =
    await supabase
      .from(process.env.SIMULATIONS_TABLE_NAME as string)
      .update({ state })
      .eq("id", simulationId)
      .select()
      .single();

  if (error) throw new Error(error.message);

  return simulation;
};
