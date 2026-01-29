import React from "react";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sgbsefgldsmzbvzvpjxt.supabase.co";
const supabaseKey = "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp";

export const supabase = createClient(supabaseUrl, supabaseKey);
