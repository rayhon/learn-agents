// In real life: from "@remix-run/node"
import {useLoaderData, json, type FrameworkLoaderArgs} from "./framework";

type Task = { id: number; title: string };

const loader = async ({request, params}: FrameworkLoaderArgs) => {
    //return list of tasks
    const tasks = await getTasks();
    return json({ tasks });
};

async function getTasks(): Promise<Task[]> {
    return [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
        { id: 3, title: "Task 3" },
    ];
}

export {loader};

export default function Route1Component() {
    const { tasks } = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>My Tasks</h1>
            <ul>{tasks.map(task => <li key={task.id}>{task.title}</li>)}</ul>
        </div>
    );
}



