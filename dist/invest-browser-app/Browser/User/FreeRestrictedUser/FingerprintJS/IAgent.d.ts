import { ResultDto } from "./ResultDto.js";
export interface IAgent {
    get(): Promise<ResultDto>;
}
