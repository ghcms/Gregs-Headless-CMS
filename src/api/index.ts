import { FastifyInstance } from "fastify";
import { expandGraphQL, lockGraphQL } from "./src/graphql";
import form from "./src/formFilter";
import nest from "./src/nestedValues";

export interface GraphQLFunctions {
    expand: (path:string, file_name:string, resolver?:any, mutator?:any) => void;
    lock: (app:FastifyInstance, graphiql?:boolean, path?:string) => Promise<void>;
    filter: (context:any) => any;
    nested: (context:any) => any;           
}

export let graphql:GraphQLFunctions = {
    expand: (path:string, file_name:string, resolver?:any, mutator?:any) => expandGraphQL(path, file_name, resolver, mutator),
    lock: (app:FastifyInstance, graphiql?:boolean, path?:string) => lockGraphQL(app, graphiql, path),
    filter: (context:any) => form(context),
    nested: (context:any) => nest(context)
};