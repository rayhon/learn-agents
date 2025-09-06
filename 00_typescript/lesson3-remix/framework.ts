export interface FrameworkLoaderArgs {
    request: Request;
    params: { [key: string]: string | undefined };
}

export type Loader = (args: FrameworkLoaderArgs) => Promise<Response>;
type GenericResponse = Response

// ideally, if we don't need to use the Response from fetch API, we can do:
//export type Loader = (args: FrameworkLoaderArgs) => Promise<Response<T>>;


export type TypedResponse<T> = Response & { __brandssss: T };

export const json = <T,>(data: T): TypedResponse<T> => {
    const response = new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
    return response as TypedResponse<T>;
};

export type InferLoaderData<T> = T extends (...args: any[]) => Promise<TypedResponse<infer U>> ? U : never;
export declare function useLoaderData<TLoader>(): InferLoaderData<TLoader>;