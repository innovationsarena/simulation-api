import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Environment, supabase } from "@core";

export const createEnvironment = async (
  environment: Environment
): Promise<Environment> => {
  const {
    data: createdEnvironment,
    error,
  }: PostgrestSingleResponse<Environment> = await supabase
    .from(process.env.ENVIRONMENTS_TABLE_NAME as string)
    .insert(environment)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return createdEnvironment;
};

export const getEnvironment = async (
  environmentId: string
): Promise<Environment> => {
  const { data: environment, error }: PostgrestSingleResponse<Environment> =
    await supabase
      .from(process.env.ENVIRONMENTS_TABLE_NAME as string)
      .select("*")
      .eq("id", environmentId)
      .single();

  if (error) throw new Error(error.message);

  return environment;
};

export const updateEnvironment = async (
  environment: Environment
): Promise<Environment> => {
  const {
    data: updatedEnvironment,
    error,
  }: PostgrestSingleResponse<Environment> = await supabase
    .from(process.env.ENVIRONMENTS_TABLE_NAME as string)
    .update(environment)
    .eq("id", environment.id)
    .single();

  if (error) throw new Error(error.message);

  return updatedEnvironment;
};

export const deleteEnvironment = async (
  environmentId: string
): Promise<void> => {
  const { data, error }: PostgrestSingleResponse<Environment> = await supabase
    .from(process.env.ENVIRONMENTS_TABLE_NAME as string)
    .delete()
    .eq("id", environmentId)
    .single();

  if (error) throw new Error(error.message);

  return;
};
