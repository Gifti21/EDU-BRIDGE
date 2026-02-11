import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/registrations/[id]/reject
 * Reject a pending user registration request with reason
 *t 10 charaaslet be at n mustion reasoecRejor: "{ err            n(
    Response.jsoturn Next re           {
ength < 10) .trim().lon || reason (!reas    ify;

     } = body, reason reviewedBnst {   co     ();
quest.jsony = await re bod   const  ms;
    = paranst { id }       co{
 {
    try  } }
) ngris: { id: stparam }: { paramst,
    {  NextRequesest:T(
    requion POSc functort asyn */
expn status
 registratiopdated* @returns Uon
 ejecti for r- Reasonody reason @b
 *  requestected the rejr ID who - Admin useviewedByody re * @bt ID
eseqution r- Registraid ram @pa 
 * 