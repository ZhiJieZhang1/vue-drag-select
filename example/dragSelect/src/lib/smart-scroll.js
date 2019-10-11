//--------注： 这是一种解决方案，下面代码，没有考虑兼容，和最优实现，但是整体流程是一种还不错的方案------//

var toSmartScroll = (function() {
  // 常量定义
  const STATUS_MEMORY = 1, //不在可视区，在内存中
      STATUS_VIEW = 2, // 在可视区
      DATASET_ID = 'exSmartId';

  /**
   *  ----都懂得，通过闭包的形式，创建几个变量: 这几个变量想常住内存，有尼玛不想污染全局变量
   *
   *  创建一个文档碎片，缓存dom
   *  创建viewPort，缓存当前滚动节点
   *  创建一个nodeMap，缓存子节点信息
   */
  let fragment = document.createDocumentFragment(),
      viewPort = '',
      nodeMap = {};

  /**
   *  是否为根节点
   */
  const isRoot = (element) => {
      return element == document.body ||
          element == document.documentElement;
  };

  /**
   *  clasName 判断
   */
  const hasClass = (node, className) => {
      var cNames = node.className.split(/\s+/); //根据空格来分割node里的元素；
      for (var i = 0; i < cNames.length; i++) {
          if (cNames[i] == className) return true;
      }
      return false;
  };

  /**
   *  util 对象，提供一些工具方法
   */
  const util = {
      /**
       *  计算两个有层级关系的dom的距离
       *  @returns {obj}  {x: x, y:x}
       */
      offset: (from, to) => {
          if (!from) {
              return null;
          }
          let node = from,
              result = {
                  x: 0,
                  y: 0
              },
              isroot, delta, border;

          while (!!node && node != to) {
              // 缓存父元素的 position值
              let position = node.parentNode.style.position;

              //offsetLeft 是计算到已经定位的父元素距离，否则就是到body的距离，所以手动把父元素 absolute
              node.parentNode.style.position = 'absolute';

              isroot = isRoot(node) || node == from;
              delta = isroot ? 0 : node.scrollLeft;
              border = parseInt(node.style.borderLeftWidth) || 0;
              result.x += node.offsetLeft + border - delta;

              delta = isroot ? 0 : node.scrollTop;
              border = parseInt(node.style.borderTopWidth) || 0;
              result.y += node.offsetTop + border - delta;

              //恢复父元素的position 原来的值
              node.parentNode.style.position = position;
              node = node.parentNode;
          }
          return result;
      },
      /**
       *  把某个node 节点缓存到文档碎片里
       *  @returns {void}
       */
      removeByEC: (node) => {
          if (!!node) {
              try {
                  fragment.appendChild(node);
              } catch (ex) {
                  console.error(ex);
              }
          }
      },

      /**
       *  获取className
       */
      getByClassName: (className) => {
          if (document.getElementByClassName) {
              return document.getElementByClassName(className) //FF下因为有此方法，所以可以直接获取到；
          }
          let nodes = document.getElementsByTagName("*"); //获取页面里所有元素，因为他会匹配全页面元素，所以性能上有缺陷，但是可以约束他的搜索范围；
          let arr = []; //用来保存符合的className；
          for (let i = 0; i < nodes.length; i++) {
              if (hasClass(nodes[i], className)) arr.push(nodes[i]);
          }
          return arr;
      }
  };

  //--------下面几个函数就是主要的流程函数了

  //创建一个和node节点一样的空元素，占位置原来的元素
  const getHolder = (node, cache) => {
      let div = document.createElement(node.tagName);
      div.className = node.className;
      div.setAttribute(DATASET_ID, Math.random()); //生成一个标识ID，这个ID 就是用来和原来的nodo关联的关键，id生成的规则可以其他的
      div.style.height = cache.height + 'px';
      return div;
  };


  // check node visible
  /**
   *  判断node 节点是否在可视区域的
   *  @param   {dom} node 节点
   *  @param   {obj} port 父节点的信息： {top：滚动距离，height：父节点高度}
   *  @param   {obj} cache node点的信息： {top：距离外边框上距离，height：高度}
   */
  const isVisible = (node, port, cache) => {
      // check cache
      if (!cache) {
          cache = {
              top: util.offset(node, viewPort).y,
              height: node.offsetHeight
          };
      }

      // check visible
      var btm1 = cache.top + cache.height,
          btm2 = port.top + port.height;
          // 判断位置 在可视区上面 或者可视区下面
      return !(btm1 < port.top || cache.top > btm2);
  };

  // move node to memory
  /**
   *  把node节点 移入近内存
   *  @param   {dom} node 节点
   *  @param   {obj} cache node点的信息： {top：距离外边框上距离，height：高度}
   */
  const moveToMemory = (node, cache) => {
      if (!cache) {
          cache = {
              top: util.offset(node, viewPort).y,
              height: node.offsetHeight
          };
          cache.source = node;
          cache.holder = getHolder(node, cache); //构建一个占位dom
          nodeMap[cache.holder.getAttribute(DATASET_ID)] = cache; //把各种信息写进 nodeMap 缓存起来
      }
      // 标记当前node的状态
      cache.status = STATUS_MEMORY;
      //把占位元素查到 节点后面
      node.insertAdjacentElement('afterEnd', cache.holder);
      //把此节点转移近内存 的文档碎片中
      util.removeByEC(node);
  };

  // move node to page
  /**
   *  把node节点从文档碎片拿出来，替换掉占位元素
   *  @param   {dom} holder 占位节点
   *  @param   {obj} cache node点的信息： {top：距离外边框上距离，height：高度}
   */
  const moveToPage = (holder, cache) => {
      holder.insertAdjacentElement('afterEnd', cache.source);
      cache.status = STATUS_VIEW;
      util.removeByEC(holder);
  };

  /**
    * 主函数：把一个滚动node节点，转换成“聪明”的滚动元素
    *
    * @param   element   需要转换的node 节点
    * @param   className 是否只操作此节点下的某些元素，可以不传，默认操作element 下所有的childNodes
    * @returns {void}
    */


  return (element, className) => {
      viewPort = element,
          nodeMap = {};

      //滚动事件
      element.addEventListener("scroll", () => {
          //获取element 下的所以元素，以便缓存和销毁，list是个类数组
          let list = !className ?
              element.children || element.childNodes :
              util.getByClassName(className);


          let port = {
              top: viewPort.scrollTop, //element 自身滚动的距离
              height: viewPort.clientHeight  //element 高度
          };

          //类数组转换下
          Array.prototype.slice.call(list).forEach((it) => {
              let id = it.getAttribute(DATASET_ID), //每个node 都有一个自己的标识id
                  cache = nodeMap[id],  //操作过于频繁，在把节点写入内存阶段(moveToMemory方法)，把节点的信息缓存到map里了，后面每次从nodeMap里取
                  //判断某个子node  是否在可视区域
                  visible = isVisible(it, port, cache);

              // 如果子节点不在可视区 move to cache
              if (!visible && (!cache || cache.status === STATUS_VIEW)) {
                  moveToMemory(it, cache);
              }

              // move to page
              if (visible && !!cache && cache.status === STATUS_MEMORY) {
                  moveToPage(it, cache);
              }
          })
      }, false);
  }

})()
