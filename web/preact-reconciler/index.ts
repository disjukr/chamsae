import { IS_BROWSER } from "$fresh/runtime.ts";
import {
  type Component,
  type ComponentChild,
  type ComponentChildren,
  type Options,
  options as _options,
  render,
  type VNode,
} from "preact";

const _customElements = IS_BROWSER ? customElements : { define() {} };
const _HTMLElement = IS_BROWSER ? HTMLElement : class {
  appendChild(): any {}
  removeChild(): any {}
  insertBefore(): any {}
} as any as { new (): HTMLElement };

interface FiberNode<T = any> extends HTMLElement {
  ownerSVGElement?: null;
  fiber?: Fiber;
  containerInfo: T;
  hostConfig: HostConfig;
}

export interface Fiber<P = any, I = any, R = any> extends VNode<P> {
  __c?: Component & {
    __P: FiberNode<R>;
  };
  __e: FiberNode<R>;
  __: Fiber;
  __type?: string;
  stateNode?: I;
  type: string;
  container: FiberNode<R>;
  props: P & { children: ComponentChildren };
  memoizedProps?: P & { children: ComponentChildren };
}

export interface HostConfig<
  Type = string,
  Props = Record<string, any>,
  Container = any,
  Instance = any,
  TextInstance = any,
  PublicInstance = any,
  HostContext = any,
  UpdatePayload = any,
> {
  createInstance(
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext,
    internalHandle: Fiber<Props, Instance, Container>,
  ): Instance;
  finalizeInitialChildren(
    instance: Instance,
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext,
  ): boolean;
  prepareUpdate(
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainer: Container,
    hostContext: HostContext,
  ): UpdatePayload | null;
  getPublicInstance(instance: Instance | TextInstance): PublicInstance;
  appendChild?(parent: Instance, child: Instance | TextInstance): void;
  appendChildToContainer?(
    container: Container,
    child: Instance | TextInstance,
  ): void;
  insertBefore?(
    parent: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ): void;
  insertInContainerBefore?(
    container: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ): void;
  removeChild?(parent: Instance, child: Instance | TextInstance): void;
  removeChildFromContainer?(
    container: Container,
    child: Instance | TextInstance,
  ): void;
  commitMount?(
    instance: Instance,
    type: Type,
    props: Props,
    internalHandle: Fiber<Props, Instance, Container>,
  ): void;
  commitUpdate?(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    prevProps: Props,
    nextProps: Props,
    internalHandle: Fiber<Props, Instance, Container>,
  ): void;
  [name: string]: unknown;
}

class FiberNode extends _HTMLElement {
  setAttribute(name: string, value: any): void {
    (this as Record<string, unknown>)[name] = value;
    const fiber = this.fiber;
    if (fiber?.__type) {
      const container = fiber.container;
      const HostConfig = (this.hostConfig ??= container.hostConfig);
      const containerInfo = container.containerInfo;
      fiber.props[name] = value;
      if (fiber.stateNode) {
        const update = HostConfig.prepareUpdate(
          fiber.stateNode,
          fiber.__type,
          fiber.memoizedProps,
          fiber.props,
          containerInfo,
          null,
        );
        if (update) {
          HostConfig.commitUpdate!(
            fiber.stateNode,
            update,
            fiber.__type,
            fiber.memoizedProps,
            fiber.props,
            fiber,
          );
        }
      } else {
        this.ownerSVGElement = null;
        delete fiber.props.fiber;
        fiber.memoizedProps = { ...fiber.props };
        fiber.stateNode = HostConfig.createInstance(
          fiber.__type,
          fiber.props,
          containerInfo,
          null,
          fiber,
        );
        let ref = fiber.ref;
        Object.defineProperty(fiber, "ref", {
          get() {
            return ref;
          },
          set(value) {
            ref = (self) => {
              const publicInstance = self === null
                ? null
                : HostConfig.getPublicInstance(fiber.stateNode);
              if (value && "current" in value) value.current = publicInstance;
              else value?.(publicInstance);
            };
          },
        });
        fiber.ref = ref;
        const pending = HostConfig.finalizeInitialChildren(
          fiber.stateNode,
          fiber.__type,
          fiber.props,
          containerInfo,
          null,
        );
        if (pending) {
          HostConfig.commitMount!(
            fiber.stateNode,
            fiber.__type,
            fiber.props,
            fiber,
          );
        }
      }
      fiber.memoizedProps[name] = value;
    }
  }
  appendChild<T extends Node>(node: T): T {
    const child = node as unknown as FiberNode;
    if (this.fiber) {
      this.hostConfig.appendChild!(
        this.fiber.stateNode,
        child.fiber!.stateNode,
      );
    } else {
      this.hostConfig.appendChildToContainer!(
        this.containerInfo,
        child.fiber!.stateNode,
      );
    }
    return super.appendChild(node);
  }
  insertBefore<T extends Node>(node: T, beforeNode: Node | null): T {
    if (beforeNode === null) return this.appendChild(node);
    const child = node as unknown as FiberNode;
    const beforeChild = beforeNode as unknown as FiberNode;
    if (this.fiber) {
      this.hostConfig.insertBefore!(
        this.fiber.stateNode,
        child.fiber!.stateNode,
        beforeChild.fiber!.stateNode,
      );
    } else {
      this.hostConfig.insertInContainerBefore!(
        this.containerInfo,
        child.fiber!.stateNode,
        beforeChild.fiber!.stateNode,
      );
    }
    return super.insertBefore(node, beforeNode);
  }
  removeChild<T extends Node>(node: T): T {
    const child = node as unknown as FiberNode;
    if (this.fiber) {
      this.hostConfig.removeChild!(
        this.fiber.stateNode,
        child.fiber!.stateNode,
      );
    } else {
      this.hostConfig.removeChildFromContainer!(
        this.containerInfo,
        child.fiber!.stateNode,
      );
    }
    return super.removeChild(node);
  }
}

interface InternalOptions extends Options {
  __(vnode: VNode, parent: HTMLElement): void;
  __b(vnode: VNode): void;
  __c?(vnode: VNode, commitQueue: Component[]): void;
  __r(vnode: VNode): void;
  __h(component: Component, index: number, type: number): void;
  __s?: boolean;
  __e(
    error: any,
    vnode: VNode,
    oldVNode?: VNode,
    errorInfo?: { componentStack?: string },
  ): void;
}
const options = _options as InternalOptions;

export interface Reconciler {
  createContainer<T>(containerInfo: T): FiberNode<T>;
  updateContainer<T>(element: ComponentChild, container: FiberNode<T>): void;
  createPortal(
    children: ComponentChild,
    containerInfo: any,
    implementation: any,
    key?: string | null,
  ): void;
  injectIntoDevTools(devToolsConfig: any): any;
}

let id!: string;
function init() {
  if (id) return;
  if (!IS_BROWSER) return;
  _customElements.define(id = "preact-reconciler", FiberNode);
  const DIFF = options.__b;
  options.__b = (vnode) => {
    const fiber = vnode as Partial<Fiber>;
    if (typeof fiber.type === "string" && !fiber.container) {
      let root = fiber.__;
      while (root?.__) root = root.__;
      fiber.container = root?.__c!.__P;
      if (fiber.container?.hostConfig) {
        fiber.__type = fiber.type;
        fiber.type = id;
        fiber.props.fiber = fiber;
      }
    }
    DIFF?.(vnode);
  };
}

export default (hostConfig: HostConfig): Reconciler => {
  init();
  return {
    createContainer(containerInfo) {
      const container = new FiberNode();
      container.containerInfo = containerInfo;
      container.hostConfig = hostConfig;
      return container;
    },
    updateContainer: render,
    createPortal() {},
    injectIntoDevTools() {},
  };
};
