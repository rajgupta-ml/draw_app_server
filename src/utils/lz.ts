import {compressToBase64, decompressFromBase64} from "lz-string"
import { safeFnCallSync, type safeResultType } from "./safeFnCall";
import type { SafeParseReturnType } from "zod/v3";

export const handleCompression = (data: string): safeResultType<string, Error> => {
    return safeFnCallSync<string, Error>(() => compressToBase64(data));
};

export const handleDecompress = (data : string) : safeResultType<string, Error> => {
    return safeFnCallSync<string, Error>(() => decompressFromBase64(data));
}
  