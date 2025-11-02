import { CONFIG } from "@/config";
import { CoreV1Api, KubeConfig, Metrics } from "@kubernetes/client-node"
import { K8ServiceClient } from "./k8.service";

export class NodeMetricesService {
    private _k8Config: KubeConfig;
    private _metricesApi: Metrics;
    private _coreApi: CoreV1Api;

    constructor(k8Config: KubeConfig, coreApi: CoreV1Api) {
        this._k8Config = k8Config;
        this._metricesApi = new Metrics(this._k8Config);
        this._coreApi = coreApi;
    }

    async checkMemoryUsage(): Promise<number> {
        try {
            const nodeResponse = await this._coreApi.readNode({ name: CONFIG.K8S_NODE_NAME });
            const allNodes = await this._metricesApi.getNodeMetrics();
            const nodeMetrice = allNodes.items.find((node) => node.metadata?.name === CONFIG.K8S_NODE_NAME);
            
            if (!nodeMetrice) {
                throw new Error(`Node metrics not found for: ${CONFIG.K8S_NODE_NAME}`);
            }

            // Handle both possible response structures
            const nodeData = (nodeResponse as any).body || nodeResponse;
            const capacity = nodeData?.status?.capacity?.memory;
            const usage = nodeMetrice.usage?.memory;

            if (!capacity || !usage) {
                throw new Error("Memory information not available");
            }

            const totalBytes = this.parseK8sMemory(capacity);
            const usedBytes = this.parseK8sMemory(usage);
            const usagePercent = (usedBytes / totalBytes) * 100;

            return parseFloat(usagePercent.toFixed(2));
        } catch (e: any) {
            console.error("Error checking memory usage:", e.message);
            return 0;
        }
    }

    private parseK8sMemory(memStr: string): number {
        const match = memStr.match(/^(\d+)([A-Za-z]*)$/);
        if (!match) return parseInt(memStr);

        const value = parseInt(match[1]);
        const unit = match[2];

        const multipliers: Record<string, number> = {
            'Ki': 1024,
            'Mi': 1024 ** 2,
            'Gi': 1024 ** 3,
            'Ti': 1024 ** 4,
            'K': 1000,
            'M': 1000 ** 2,
            'G': 1000 ** 3,
            'T': 1000 ** 4,
            '': 1,
        };

        return value * (multipliers[unit] || 1);
    }
}

export const NodeMetricesServiceClient = new NodeMetricesService(
    K8ServiceClient.getConfig(),
    K8ServiceClient.getCoreApi()
);