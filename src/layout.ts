import { renderToStaticMarkup } from "react-dom/server";
import { Entry } from "./entry";

// export default function render(content: string, entry: Entry) {
//   const ancestors = entry.ancestors;
//   const children = entry.children;
//   return renderToStaticMarkup(
//     <html>
//       <head>
//         <title>{entry.title}</title>
//         <link rel="stylesheet" href="/_styles/style.css" />
//       </head>
//       <body>
//         <nav id="breadcrumbs">
//           <menu>
//             {ancestors.map((e) => (
//               <li key={e.link}>
//                 <a href={e.link}>{e.title}</a>
//               </li>
//             ))}
//             <li key={entry.link}>{entry.title}</li>
//           </menu>
//         </nav>
//         <main dangerouslySetInnerHTML={{ __html: content }}></main>
//         <nav id="contents">
//           <menu>
//             {children
//               .filter((e) => !e.hidden)
//               .map((e) => (
//                 <li key={e.link}>
//                   <a href={e.link}>{e.title}</a>
//                 </li>
//               ))}
//           </menu>
//         </nav>
//       </body>
//     </html>
//   );
// }
