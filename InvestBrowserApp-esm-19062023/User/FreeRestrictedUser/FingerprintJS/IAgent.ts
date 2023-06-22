import { ResultDto } from "./ResultDto"

export interface IAgent {
    get(): Promise<ResultDto>
}