import { useState, useEffect } from "react";
import { ethers} from "ethers";


import { useSetMilestones } from "../../hooks/useCreatemilestone";
import { useAssignWorker } from "../../hooks/useAssignWoker";
interface MilestoneModalProps {
  isOpen: boolean;
  job: any; // Replace with your Job type
  onClose: () => void;
  onSuccess: () => void;
}

const MilestoneModal = ({ isOpen, job, onClose, onSuccess }: MilestoneModalProps) => {
  const [activeTab, setActiveTab] = useState<"milestones"|"assignWorker">("milestones");
  const [milestones, setMilestones] = useState<Array<{
    title: string;
    description: string;
    amount: string;
    deadline: Date;
  }>>([]);
  const [workerAddress, setWorkerAddress] = useState("");

  const { setMilestones: setContractMilestones, isPending: isSettingMilestones } = useSetMilestones();
  const { assignWorker, isPending: isAssigning } = useAssignWorker();

  useEffect(() => {
    if (job && job.milestoneCount) {
      // Initialize empty milestones
      const count = Number(job.milestoneCount);
      setMilestones(Array(count).fill(0).map(() => ({
        title: "",
        description: "",
        amount: "",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 1 week from now
      })));
    }
  }, [job]);

  const handleSetMilestones = async () => {
    try {
      await setContractMilestones(job.address, {
        indices: milestones.map((_, i) => i),
        titles: milestones.map(m => m.title),
        descriptions: milestones.map(m => m.description),
        amounts: milestones.map(m => m.amount),
        deadlines: milestones.map(m => m.deadline)
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to set milestones:", error);
    }
  };

  const handleAssignWorker = async () => {
    try {
      await assignWorker(job.address, workerAddress);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign worker:", error);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Manage Job</h3>
          <button onClick={onClose} className="text-gray-500">×</button>
        </div>

        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'milestones' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            Set Milestones
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'assignWorker' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('assignWorker')}
          >
            Assign Worker
          </button>
        </div>

        {activeTab === 'milestones' ? (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="border p-4 rounded">
                <h4 className="font-medium">Milestone {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].title = e.target.value;
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Amount (ETH)</label>
                    <input
                      type="text"
                      value={milestone.amount}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].amount = e.target.value;
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].description = e.target.value;
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Deadline</label>
                    <input
                      type="date"
                      value={milestone.deadline.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].deadline = new Date(e.target.value);
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleSetMilestones}
              disabled={isSettingMilestones}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSettingMilestones ? 'Saving...' : 'Save Milestones'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Worker Address</label>
              <input
                type="text"
                value={workerAddress}
                onChange={(e) => setWorkerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAssignWorker}
              disabled={isAssigning || !workerAddress}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isAssigning ? 'Assigning...' : 'Assign Worker'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneModal;