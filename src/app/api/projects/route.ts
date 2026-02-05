import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// GET: Fetch all projects from Firestore
export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST: Add a new project to Firestore
export async function POST(request: Request) {
    try {
        const newProject = await request.json();
        const docRef = await addDoc(collection(db, "projects"), newProject);
        return NextResponse.json({ id: docRef.id, ...newProject });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
    }
}
