type Victims = {
  uuid: string;
  name: string;
  ip: string;
  status: string;
};

type Victim = {
  id: string;
  computer_name: string;
  os: string;
  architecture: string;
  version: string;
  ipv4: string;
  status: string;
  created_at: string;
};

type CommandResultType = {
  result: string;
  error: string;
};
