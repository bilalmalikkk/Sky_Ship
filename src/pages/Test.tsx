import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Test = () => {
  const [localStorageData, setLocalStorageData] = useState<string>("");

  const checkLocalStorage = () => {
    const registeredUsers = localStorage.getItem("registeredUsers");
    const currentUser = localStorage.getItem("user");
    
    setLocalStorageData(JSON.stringify({
      registeredUsers: registeredUsers ? JSON.parse(registeredUsers) : [],
      currentUser: currentUser ? JSON.parse(currentUser) : null
    }, null, 2));
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("registeredUsers");
    localStorage.removeItem("user");
    setLocalStorageData("");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Page</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LocalStorage Test</CardTitle>
                <CardDescription>Check what's stored in localStorage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={checkLocalStorage}>Check LocalStorage</Button>
                <Button onClick={clearLocalStorage} variant="outline">Clear LocalStorage</Button>
                
                {localStorageData && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">LocalStorage Data:</h3>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                      {localStorageData}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Instructions</CardTitle>
                <CardDescription>How to test the registration and login flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Test Registration:</h3>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Go to <code className="bg-gray-100 px-1 rounded">/signup</code></li>
                    <li>Fill out the registration form</li>
                    <li>Check console for registration logs</li>
                    <li>Use "Check LocalStorage" button above</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">2. Test Login:</h3>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Go to <code className="bg-gray-100 px-1 rounded">/login</code></li>
                    <li>Use the credentials you just registered</li>
                    <li>Check console for login logs</li>
                    <li>Should redirect to home page if successful</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Demo Accounts:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Admin:</strong> admin@skyship.com / admin123</li>
                    <li><strong>Moderator:</strong> moderator@skyship.com / mod123</li>
                    <li><strong>User:</strong> user@skyship.com / user123</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Test;
