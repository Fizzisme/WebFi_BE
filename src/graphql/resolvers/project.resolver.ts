import type { ICreateProjectInput } from '../typeDefs/project.type.ts';
import {projectService} from '../../services/projectService.ts';

export const projectResolver = {
    Query: {
        projects: async () => {
            return await projectService.getAll();
        },

        projectsByCategory: async (_: unknown, args: { categoryId: string }) => {
            return await projectService.getByCategory(args.categoryId);
        },

        projectsBySubCategory: async (_: unknown, args: { subSlug: string }) => {
            return await projectService.getBySubCategory(args.subSlug);
        },

        project: async (_: unknown, args: { id: string }) => {
            return await  projectService.getOneById(args.id);
        }
    },
    Mutation: {
        createProject: async(_: unknown, args:{input: ICreateProjectInput})=>{
            return await projectService.creatNew(args.input);
        }
    },
};
