export interface IMap {
    panTo([x, y]: number[], zoom?: number): Promise<void>;
    setCenter([x, y]: number[], zoom?: number): Promise<void>;
    setZoom(zoom: number): Promise<void>;
    setZoomRange(minZoom: number, maxZoom: number): Promise<void>;
    onZoomInBoundsing?: CallableFunction;
    onZoomOutBoundsing?: CallableFunction;
}
