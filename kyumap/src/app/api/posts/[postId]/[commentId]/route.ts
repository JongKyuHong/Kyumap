import { NextRequest } from "next/server";

type Props = {  
    params: {
        postId: string,
        commentId: string,
    }
}

export async function GET(req: NextRequest, {params}: Props){
    
}